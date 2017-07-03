import requests
from bs4 import BeautifulSoup

spanish_base_url = "https://www.memrise.com/course/737/first-5000-words-of-spanish/"

#Hardcode it for 63 because only 63 things
for pageNum in range(2,64):
    page = requests.get(spanish_base_url+str(pageNum))
    soup = BeautifulSoup(page.content, 'html.parser')
    spanishWords = soup.find_all(class_="col_a col text")
    englishWords = soup.find_all(class_="col_b col text")
    if spanishWords and englishWords:
        if len(spanishWords) != len(englishWords):
            print("Error: Words don't match!")
            break
        for wordPairs in range(len(spanishWords)):
            print(spanishWords[wordPairs].text)
            print(englishWords[wordPairs].text)

            #Needs to perform some parsing
