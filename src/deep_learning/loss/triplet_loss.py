import tensorflow as tf
from tensorflow.python.ops import array_ops
from tensorflow.python.ops import math_ops
from tensorflow.python.framework import dtypes
from src.deep_learning.loss.pairwise_loss import pairwise_distance, masked_maximum, masked_minimum

def triplet_loss(vects):
    margin = 1.
    labels = vects[:, :1]
 
    labels = tf.cast(labels, dtype='int32')

    embeddings = vects[:, 1:]

    # Build pairwise squared distance matrix.
    pdist_matrix = pairwise_distance(embeddings, squared=True)

    # Build pairwise binary adjacency matrix.
    adjacency = math_ops.equal(labels, array_ops.transpose(labels))

    # Invert so we can select negatives only.
    adjacency_not = math_ops.logical_not(adjacency)

    # global batch_size  
    batch_size = array_ops.size(labels)

    """
        this part creates a mask to filter out pairs of points based on an adjacency matrix and the pairwise distance matrix.
        The mask ensures that only pairs of points that are not adjacent in the graph and have a greater pairwise distance than the corresponding distances in the original matrix are considered.
    """

    # Compute the mask.
    # tile: making it compatible for element-wise operations with other tensors.
    # reshape: reshapes the transposed tensor into a column vector, effectively converting it into a 1D tensor.
    pdist_matrix_tile = array_ops.tile(pdist_matrix, [batch_size, 1])
    mask = math_ops.logical_and(
        array_ops.tile(adjacency_not, [batch_size, 1]),
        math_ops.greater( pdist_matrix_tile, array_ops.reshape(array_ops.transpose(pdist_matrix), [-1, 1]) )
        )
    """
    The resulting mask_final tensor will have True values where at least one element of the corresponding row in the original mask tensor was True,
    indicating that at least one pair of points satisfied the conditions imposed by the mask. 
    Otherwise, it will have False values. 
    This final mask can be used for further computations or filtering.
    """
    mask_final = array_ops.reshape(
        math_ops.greater(
            math_ops.reduce_sum(
                math_ops.cast(mask, dtype=dtypes.float32), 1, keepdims=True), 0.0), [batch_size, batch_size]
        )
        
    mask_final = array_ops.transpose(mask_final)

    adjacency_not = math_ops.cast(adjacency_not, dtype=dtypes.float32)
    mask = math_ops.cast(mask, dtype=dtypes.float32)

    # negatives_outside: smallest D_an where D_an > D_ap.
    # masked_minimum: it finds the smallest distance for each row of pdist_matrix_tile where the corresponding entry in the mask is True.
    # after reshaping: Each row contains the minimum distance outside of the positive pairs for a particular sample.
    """
    The resulting negatives_outside tensor contains the minimum distances outside of each positive pair for each sample in the batch, 
    organized such that each row represents a positive pair and each column represents the negative distances outside of that positive pair for all samples. 
    This can be useful for computing loss functions in metric learning or contrastive learning tasks.
    """
    negatives_outside = array_ops.reshape(
        masked_minimum(pdist_matrix_tile, mask), [batch_size, batch_size])
    negatives_outside = array_ops.transpose(negatives_outside)

    """
    The resulting semi_hard_negatives tensor contains the semi-hard negative distances for each positive pair in the batch. 
    For positive pairs where at least one semi-hard negative pair exists (indicated by mask_final), 
    the corresponding distances from negatives_outside are chosen. 
    For positive pairs where no semi-hard negative pair exists, 
    the distances from negatives_inside are chosen. 
    This operation helps in selecting appropriate negative examples for triplet loss or similar loss functions in metric learning tasks.
    """
    # negatives_inside: largest D_an.
    negatives_inside = array_ops.tile(
        masked_maximum(pdist_matrix, adjacency_not), [1, batch_size])
    semi_hard_negatives = array_ops.where(
        mask_final, negatives_outside, negatives_inside)

    loss_mat = math_ops.add(margin, pdist_matrix - semi_hard_negatives)

    mask_positives = math_ops.cast(
        adjacency, dtype=dtypes.float32) - array_ops.diag(
        array_ops.ones([batch_size]))

    # in semihard, we take all positive pairs except the diagonal.
    num_positives = math_ops.reduce_sum(mask_positives)

    # multiply: This effectively masks out the loss values for positive pairs
    # maximum: to ensure that all negative loss values are set to zero.
    # sum: This effectively sums up the loss values for all positive pairs, where negative loss values are set to zero.
    # truediv: This effectively computes the average loss for all positive pairs.
    # This loss can be used to train models in metric learning tasks such as siamese networks.
    semi_hard_triplet_loss_distance = math_ops.truediv(
        math_ops.reduce_sum(
            math_ops.maximum(
                math_ops.multiply(loss_mat, mask_positives), 0.0)), num_positives, name='triplet_semihard_loss')
    
    return semi_hard_triplet_loss_distance

def triplet_loss_output(y_true, y_pred):
    return triplet_loss(y_pred)