import pymongo
import os
from dotenv import load_dotenv

load_dotenv(".env.local")

uri = os.getenv("MONGODB_URI")
if not uri:
    print("No MongoDB URI found")
    exit(1)

client = pymongo.MongoClient(uri)
db = client.get_default_database() or client["ProxySaaS"]
users_col = db["users"]

res = users_col.update_one({"email": "huanfpt03@gmail.com"}, {"$set": {"balance": 10000000, "name": "DUONG TUANH"}})
print(f"Matched: {res.matched_count}, Modified: {res.modified_count}")
