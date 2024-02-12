import os
from keras_bert import load_vocabulary

class BertUtils:

    @staticmethod
    def pretrained_bert(pretrained_path='uncased_L-12_H-768_A-12'):
        config_path = os.path.join(pretrained_path, 'bert_config.json')
        model_path = os.path.join(pretrained_path, 'bert_model.ckpt')
        vocab_path = os.path.join(pretrained_path, 'vocab.txt')

        # The `load_vocabulary` function is used to load the vocabulary file of a BERT
        # model. It takes the path to the vocabulary file as input and returns a
        # dictionary that maps tokens to their corresponding indices. 
        # This vocabulary is used to convert text into a sequence of token indices that can be fed into the
        # BERT model for processing.

        token_dict = load_vocabulary(vocab_path)

        return config_path, model_path, vocab_path, token_dict