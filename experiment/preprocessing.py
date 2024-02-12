import mlflow
import click
from src.jobs.data_pipeline import DataPipeline

# help: This is a keyword argument of @click.command that provides a brief description of the command 
# when the --help flag is used.
@click.command( help="SiameseQAT script for preprocessing")

# --dataset: This option specifies the dataset to be used. 
#It has a default value of "eclipse" and expects a string input.
@click.option("--dataset", default="eclipse", type=str, help="Database ex: eclipse, openoffice, netbeans")

#--preprocessor: This option specifies the preprocessor to be used. 
# It has a default value of "bert" and expects a string input.
@click.option("--preprocessor", default="bert", type=str, help="Database ex: eclipse, openoffice, netbeans")

def preprocessing(dataset, preprocessor):
    
    print("Params: dataset={}, preprocessing={}".format(dataset, preprocessor))
    
    op = {
      'eclipse' : {
        'DATASET' : 'eclipse',
        'DOMAIN' : 'eclipse'
      },
      'eclipse_small' : {
        'DATASET' : 'eclipse_small',
        'DOMAIN' : 'eclipse_small'
      },
      'netbeans' : {
        'DATASET' : 'netbeans',
        'DOMAIN' : 'netbeans'
      },
      'openoffice' : {
        'DATASET' : 'openoffice',
        'DOMAIN' : 'openoffice'
      },
      'firefox' : {
          'DATASET' : 'firefox',
          'DOMAIN' : 'firefox'
      },
      'eclipse_test' : {
          'DATASET' : 'eclipse_test',
          'DOMAIN' : 'eclipse_test'
      }
    }

    pipeline = DataPipeline(op[dataset]['DATASET'], op[dataset]['DOMAIN'], preprocessor)
    pipeline.run()

if __name__ == '__main__':
  preprocessing()