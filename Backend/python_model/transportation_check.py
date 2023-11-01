import json
import sys
import pymongo
import random
from bson.objectid import ObjectId

client = pymongo.MongoClient("mongodb+srv://Yatra:Yatra@yatrasahayak.0gw5pwg.mongodb.net/?retryWrites=true&w=majority")

attraction_db = client["Attractions"]
attractions_collection = attraction_db["attractions_in_mumbai"]
attractions_data = list(attractions_collection.find({}))

hotel_db = client["Hotels"]
hotels_collection = hotel_db["Hotels_in_Mumbai"]
hotels_data = list(hotels_collection.find({}))

restaurant_db = client["Restaurants"]
restaurants_collection = restaurant_db["restaurants_in_mumbai"]
restaurants_data = list(restaurants_collection.find({}))

bus_db = client["Buses"]
bus_collection = bus_db["buses"]
bus_data = list(bus_collection.find({}))

train_db = client["Trains"]
trains_collection = train_db["trains"]
trains_data = list(trains_collection.find({}))

flight_db = client["Flights"]
flights_collection = flight_db["flights"]
flights_data = list(flights_collection.find({}))

return_bus_db = client["Buses_return"]
return_bus_collection = return_bus_db["Buses_return"]
bus_data_return = list(return_bus_collection.find({}))

return_train_db = client["Trains_return"]
return_trains_collection = return_train_db["trains_return"]
trains_data_return = list(return_trains_collection.find({}))

return_flight_db = client["Flights_return"]
return_flights_collection = return_flight_db["flights_return"]
flights_data_return = list(return_flights_collection.find({}))



class TransportationOptionsModel:
    def __init__(self, bus_data, trains_data, flights_data):
        self.bus_data = bus_data
        self.trains_data = trains_data
        self.flights_data = flights_data

    def generate_transportation_options(self, start_location, destination, date_of_departure, date_of_return):
        available_transportation_types = set()

        for transportation_option in self.bus_data + self.trains_data + self.flights_data:
            if (transportation_option.get("departure_date") == date_of_departure
                and transportation_option.get("departure") == start_location
                and transportation_option.get("destination") == destination):
                available_transportation_types.add(transportation_option["type"])

        return available_transportation_types


data = json.loads(sys.argv[1])


# Initialize the model
transportation_option_model = TransportationOptionsModel(bus_data, trains_data, flights_data)

# Generate the itinerary
available_transportation_types = transportation_option_model.generate_transportation_options(data['start_location'], data['destination'], data['date_of_departure'], data['date_of_return'])

# available_transportation_types = transportation_option_model.generate_transportation_options("Pune", "Mumbai", "15-11-2023", "16-10-2023")


available_transportation_type = []

if available_transportation_types is not None:
    for item in available_transportation_types:
        available_transportation_type.append(item)

# Create a dictionary containing the itinerary and calculations
result = {
    'transportation':{
        'types' : available_transportation_type
    }
}

# Serialize the itinerary result using the custom JSON encoder
result = json.dumps(result)

# Send the itinerary result to the client
print(result)
