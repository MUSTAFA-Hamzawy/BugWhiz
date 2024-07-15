import numpy as np

class SoftmaxRegressionCustom:
    def __init__(self, learning_rate=0.1, num_iterations=1000, batch_size=64):
        """
        Initialize the SoftmaxRegressionCustom model.

        Args:
        learning_rate (float): Learning rate for gradient descent.
        num_iterations (int): Number of iterations for training.
        batch_size (int): Size of the mini-batches for stochastic gradient descent.
        """
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.batch_size = batch_size
        self.weights = None
        self.bias = None
        

    def _softmax(self, z):
        """
        Compute the softmax of vector z.

        Args:
        z (numpy.ndarray): Input array of shape (num_samples, num_classes).

        Returns:
        numpy.ndarray: Softmax probabilities of shape (num_samples, num_classes).
        """
        
        # Numerical stability: subtract max value
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))  
        return exp_z / np.sum(exp_z, axis=1, keepdims=True) 
    

    def _compute_cost(self, y, y_pred):
        """
        Compute the cross-entropy cost function.

        Args:
        y (numpy.ndarray): True labels, one-hot encoded of shape (num_samples, num_classes).
        y_pred (numpy.ndarray): Predicted probabilities of shape (num_samples, num_classes).

        Returns:
        float: Cross-entropy cost.
        """
        m = y.shape[0]
        
        # Add small constant for numerical stability
        cost = -np.sum(y * np.log(y_pred + 1e-9)) / m  
        return cost
    

    def _compute_gradients(self, X, y, y_pred):
        """
        Compute gradients for weights and bias.

        Args:
        X (numpy.ndarray): Input features of shape (num_samples, num_features).
        y (numpy.ndarray): True labels, one-hot encoded of shape (num_samples, num_classes).
        y_pred (numpy.ndarray): Predicted probabilities of shape (num_samples, num_classes).

        Returns:
        tuple: Gradients for weights and bias.
            - numpy.ndarray: Gradient for weights of shape (num_features, num_classes).
            - numpy.ndarray: Gradient for bias of shape (num_classes,).
        """
        m = X.shape[0]
        gradient_weights = np.dot(X.T, (y_pred - y)) / m  
        gradient_bias = np.sum(y_pred - y, axis=0) / m  
        return gradient_weights, gradient_bias
    

    def fit(self, X, y):
        """
        Train the Softmax regression model using mini-batch gradient descent.

        Args:
        X (numpy.ndarray): Input features of shape (num_samples, num_features).
        y (numpy.ndarray): True labels, one-hot encoded of shape (num_samples, num_classes).

        Returns:
        self: Returns the trained model instance.
        """
        m, n = X.shape  # Number of samples and features
        k = y.shape[1]  # Number of classes
        
        self.weights = np.zeros((n, k))  
        self.bias = np.zeros(k)  
        
        # List to store cost values during training
        self.cost_history = []  

        num_batches = int(np.ceil(m / self.batch_size))  # Number of mini-batches

        for i in range(self.num_iterations):
            for batch in range(num_batches):
                
                # Determine the batch slice
                start = batch * self.batch_size
                end = min(start + self.batch_size, m)
                X_batch = X[start:end]
                y_batch = y[start:end]

                # Compute predictions and gradients
                z = np.dot(X_batch, self.weights) + self.bias
                y_pred = self._softmax(z)
                gradient_weights, gradient_bias = self._compute_gradients(X_batch, y_batch, y_pred)

                # Update weights and bias using gradient descent
                self.weights -= self.learning_rate * gradient_weights
                self.bias -= self.learning_rate * gradient_bias

            # Compute and store the cost for the entire dataset
            z = np.dot(X, self.weights) + self.bias
            y_pred = self._softmax(z)
            cost = self._compute_cost(y, y_pred)
            self.cost_history.append(cost)

            # Print cost every 10% of the iterations or at the final iteration
            if i % (self.num_iterations // 10) == 0 or i == self.num_iterations - 1:
                print(f"Iteration {i}: Cost {cost:.4f}")

        return self
    

    def predict_probabilities(self, X):
        """
        Predict class probabilities for input samples.

        Args:
        X (numpy.ndarray): Input features of shape (num_samples, num_features).

        Returns:
        numpy.ndarray: Predicted probabilities of shape (num_samples, num_classes).
        """
        z = np.dot(X, self.weights) + self.bias
        return self._softmax(z)

    def predict(self, X):
        """
        Predict class labels for input samples.

        Args:
        X (numpy.ndarray): Input features of shape (num_samples, num_features).

        Returns:
        numpy.ndarray: Predicted class labels of shape (num_samples,).
        """
        probabilities = self.predict_probabilities(X)
        
        # Return the index of the max probability
        return np.argmax(probabilities, axis=1)  
    

    def accuracy(self, y_true, y_pred):
        """
        Compute the accuracy of predictions.

        Args:
        y_true (numpy.ndarray): True class labels of shape (num_samples,).
        y_pred (numpy.ndarray): Predicted class labels of shape (num_samples,).

        Returns:
        float: Accuracy of predictions.
        """
        return np.mean(y_true == y_pred) 
