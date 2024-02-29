import abc
# abc: Abstract Base Classes
class Tokenizer(metaclass=abc.ABCMeta):
    # this decorator: marks the apply method as an abstract method. 
    @abc.abstractmethod
    def apply(text):
        pass