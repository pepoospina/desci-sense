"""Script to run evaluation of label prediction models.

Usage:
  eval_benchmark_v0.py [--config=<config>] [--dataset=<dataset>]


Options:
--config=<config>  Optional path to configuration file.
--dataset=<dataset> Optional path to table in wandb.

"""

import wandb
from pathlib import Path
import json
import pandas as pd
import sys
import os
import docopt

sys.path.append(str(Path(__file__).parents[2]))

from desci_sense.demos.st_demo import init_model, load_config



def a_table_into_df(table_path):
    raw_data = json.load(table_path.open())

    #put it in a dataframe
    x = raw_data["columns"].index('Text')
    y = raw_data["columns"].index('True Label')

    try:
        rows = [{'Text': raw_data["data"][i][x], 'True Label': raw_data["data"][i][y]} for i in range(len(raw_data["data"]))]
    except Exception as e:
        print(f"Exception occurred: {e}")



    df = pd.DataFrame(rows)
    return df

def text_label_pred_eval(df,config):
    
    model = init_model(config)
    
    
arguments = docopt.docopt(__doc__)

# initialize config
config_path = arguments.get('--config')
config = load_config(config_path)

# initialize table path
path = "common-sense-makers/testing/labeled_data_v0:v4"

wandb.login()

api = wandb.Api()

# initialize table path
#add the option to call table_path =  arguments.get('--dataset')
path = "common-sense-makers/testing/labeled_data_v0:v4"
artifact = api.artifact(path)

#get path to table
a_path = artifact.download()
table_path = Path(f"{a_path}/labeled_data_table.table.json")

#return the pd df from the table
df = a_table_into_df(table_path)
print(df)