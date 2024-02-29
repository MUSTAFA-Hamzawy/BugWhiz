from src.nlp.tokenizer import Tokenizer
from src.utils.bert_utils import BertUtils
from keras_bert import Tokenizer as KerasBertTokenizer

class TokenizerBert(Tokenizer):
    
    def __init__(self):
        # Load pretrained BERT
        config_path, model_path, vocab_path, token_dict = BertUtils.pretrained_bert()
        print("Total vocabulary loaded: {}".format(len(token_dict)))

        self.tokenizer = KerasBertTokenizer(token_dict)

    # the apply method tokenizes the input text using the specified tokenizer 
    # returns the tokenized text as a string. 
    def apply(self, text):
        text = " ".join(self.tokenizer.tokenize(str(text)))
        return text

    # the encode: allowing for the conversion of textual data into numerical representations suitable for consumption by machine learning models.
    def encode(self, text, max_len):
        return self.tokenizer.encode(text, max_len=max_len)