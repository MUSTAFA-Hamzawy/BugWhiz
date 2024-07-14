import numpy as np
from scipy.spatial import distance  # to compute the Gaussian kernel
import cvxopt                       # to solve the dual optimization problem
import copy
from scipy.sparse import csr_matrix

class SVM:
    linear = lambda x, x_dash , c=0: x @ x_dash .T
    polynomial = lambda x, x_dash , Q=5: (1 + x @ x_dash.T)**Q
    rbf = lambda x, x_dash , gamma=10: np.exp(-gamma * distance.cdist(x, x_dash,'sqeuclidean'))
    kernel_functions = {'linear': linear, 'polynomial': polynomial, 'rbf': rbf}

    def __init__(self, kernel='linear', C=1, k=2):
        # setting the hyperparameters
        self.kernel_str = kernel
        self.kernel = SVM.kernel_functions[kernel]
        self.C = C                  # regularization parameter
        self.k = k                  # kernel hyperparameter

        # training data and support vectors
        self.X, y = None, None
        self.alpha = None
        self.multiclass = False
        self.classifiers = []  

    def fit(self, X, y, eval_train=False):
      if len(np.unique(y)) > 2:
          self.multiclass = True
          return self.multi_fit(X, y, eval_train)

      # relabel if needed
      if set(np.unique(y)) == {0, 1}: y[y == 0] = -1


      # ensure y has dimensions Nx1
      self.y = y.reshape(-1, 1).astype(np.double) # Has to be a column vector

      self.X = X
      N = X.shape[0]

      # compute the kernel over all possible pairs of (x, x') in the data
      self.K = self.kernel(X, X, self.k)

      # For 1/2 x^T P x + q^T x
      P = cvxopt.matrix(self.y @ self.y.T * self.K)
      q = cvxopt.matrix(-np.ones((N, 1)))

      # For Ax = b
      A = cvxopt.matrix(self.y.T)
      b = cvxopt.matrix(np.zeros(1))

      # For Gx <= h
      G = cvxopt.matrix(np.vstack((-np.identity(N), np.identity(N))))
      h = cvxopt.matrix(np.vstack((np.zeros((N,1)), np.ones((N,1)) * self.C)))

      # Solve
      cvxopt.solvers.options['show_progress'] = False
      sol = cvxopt.solvers.qp(P, q, G, h, A, b)
      self.alpha = np.array(sol["x"])

      # Maps into support vectors
      self.isSupportVector = ((self.alpha > 1e-3) & (self.alpha <= self.C)).squeeze()
      self.marginSupportVector = np.argmax((1e-3 < self.alpha) & (self.alpha < self.C - 1e-3))

    def multi_fit(self, X, y, eval_train=False):
        self.k = len(np.unique(y))      # number of classes
        y = np.array(y)
        # for each pair of classes
        for i in range(self.k):
            # get the data for the pair
            Xs, Ys = X, copy.copy(y)

            # change the labels to -1 and 1
            Ys[Ys!=i], Ys[Ys==i] = -1, +1

            # fit the classifier
            classifier = SVM(kernel=self.kernel_str, C=self.C, k=self.k)
            classifier.fit(Xs, Ys)
            
            # save the classifier
            self.classifiers.append(classifier)


    def predict(self, X_t):
        if self.multiclass: return self.multi_predict(X_t)
        x_s, y_s = self.X[self.marginSupportVector, np.newaxis], self.y[self.marginSupportVector]
        alpha, y, X= self.alpha[self.isSupportVector], self.y[self.isSupportVector], self.X[self.isSupportVector]

        b = y_s - np.sum(alpha * y * self.kernel(X, x_s, self.k), axis=0)
        score = np.sum(alpha * y * self.kernel(X, X_t, self.k), axis=0) + b
        return np.sign(score).astype(int), score

    def multi_predict(self, X):
        # get the predictions from all classifiers
        preds = np.zeros((X.shape[0], self.k))
        for i, classifier in enumerate(self.classifiers):
            _, preds[:, i] = classifier.predict(X)

        # get the argmax and the corresponding score
        return np.argmax(preds, axis=1)


# Initialize the SVM model
model = SVM(C = 100)


# Fit the model on the entire training data
model.fit(data1, filtered_train_df['class_label'])

# Predict the class labels for the testing data
X_test_transformed = vectorizer1.transform(filtered_test_df['bug_description'])
