import json
from abc import ABC, abstractmethod
import pandas as pd
from bson import Binary

from bson import ObjectId


class Model(ABC):
    @abstractmethod
    def get_dict(self) -> dict:
        pass

    @staticmethod
    @abstractmethod
    def get_model(model: dict):
        pass


class User(Model):
    def __init__(self, name: str, email: str, password: str, data_ids: list):
        self.name = name
        self.email = email
        self.password = password
        self.data_ids = data_ids

    def get_dict(self, get_password=True) -> dict:
        d = {
            "name": self.name,
            "email": self.email,
            "data_ids": self.data_ids,
        }
        if get_password:
            d.update({"password": self.password})
        return d

    @staticmethod
    def get_model(user: dict):
        return User(user['name'], user['email'], user['password'], user['data_ids'])


class Dataset(Model):
    def __init__(self, name, data, pickle: Binary, table_id=ObjectId()):
        self.table_id = table_id
        self.name = name
        self.pickle = pickle
        for col in data.columns:
            if 'Unnamed' in col:
                del data[col]
        self.data = data

    def get_dict(self, table_id=False) -> dict:
        d = {
            "name": self.name,
            "columns": self.data.to_json()  # ,
            # "pickle": self.pickle
        }
        if table_id:
            d.update({"table_id": str(self.table_id)})
        return d

    @staticmethod
    def get_model(dataset: dict):
        dataset = Dataset(dataset['name'],
                          pd.read_json(dataset['columns']),
                          Binary(b''),
                          dataset['_id'])
        return dataset
