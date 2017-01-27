from abc import ABC, abstractmethod


class Model(ABC):
    @abstractmethod
    def get_dict(self) -> dict:
        pass

    @staticmethod
    @abstractmethod
    def get_model(user: dict):
        pass


class User(Model):
    def __init__(self, name: str, email: str, password: str, data_ids:list, token=""):
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

# class Dataset(Model):
#     def __init__(self, name, email, password):
#         self.name = name
#         self.email = email
#         self.password = password
#         self.data_ids = list()
#
#     def get_dict(self) -> dict:
#         return {
#             "name": self.name,
#             "email": self.email,
#             "password": self.password,
#             "data_ids": self.data_ids
#         }

# class DataColumn(Model):
#     def __init__(self, label: str, values: list):
#         self.label = label
#         self.values = values
#
#     def get_dict(self) -> dict:
#         return {
#             "label": self.label,
#             "values": self.values
#         }
