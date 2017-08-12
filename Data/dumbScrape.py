import requests
from bs4 import BeautifulSoup
import DynamoDB

spanish_base_url = "https://www.memrise.com/course/33/introductory-french-vocab/"

#Hardcode it for 63 because only 63 things

words = [];

for pageNum in range(1,21):
    page = requests.get(spanish_base_url+str(pageNum))
    soup = BeautifulSoup(page.content, 'html.parser')
    foreignWords = soup.find_all(class_="col_a col text")
    englishWords = soup.find_all(class_="col_b col text")
    if foreignWords and englishWords:
        if len(foreignWords) != len(englishWords):
            print("Error: Words don't match!")
            break
        for wordPairs in range(len(foreignWords)):
            foreign = foreignWords[wordPairs].text
            english = englishWords[wordPairs].text
            print(foreign + ": " + english)

            words.append((english, foreign))

DynamoDB.main(words)
