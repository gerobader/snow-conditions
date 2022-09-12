from bs4 import BeautifulSoup
import requests
import json

page = requests.get('https://www.bergfex.at/oesterreich/schneewerte/')

page_contents = BeautifulSoup(page.content, 'html.parser')
ski_resorts = page_contents.find_all('tr')
ski_resort_information = []
for ski_resort in ski_resorts:
    #ski_resort_name = ski_resort.find('a').text
    #ski_resort_information[ski_resort_name] = {}
    data_count = 0
    resort_information = {}
    for data_point in ski_resort:
        tag = BeautifulSoup(str(data_point), 'html.parser').td
        if tag is not None:
            data_count += 1
            data = tag['data-value']
            if (data_count == 1):
                resort_information['name'] = data
            if (data_count == 2):
                resort_information['valley_snow_depth'] = int(data) if data != "" else 0
            elif (data_count == 3):
                resort_information['mountain_snow_depth'] = int(data) if data != "" else 0
            elif (data_count == 4):
                resort_information['new_snow'] = int(data) if data != "" else 0
            elif (data_count == 5):
                resort_information['open_lifts'] = int(data) if data != "" else 0
            elif (data_count == 6):
                resort_information['time'] = data

    ski_resort_information.append(resort_information)

print(json.dumps(ski_resort_information, indent=2))
