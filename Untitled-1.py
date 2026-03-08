
'''from gettext import install
import random

import pip
PASSWORD=''
a= int(input("enter noof numbers:"))
num=int(input("enter a number:"))
spe=int(input("enter a special number:"))
for x in range(a):
    d=random.choice('abcdefghijklmonpqrstuvwxyz')
    PASSWORD+=d
for y in range(num):
    n=random.choice('0123456789')
    PASSWORD+=n
for z in range(spe):
    s=random.choice('!@#$%^&*()')
    PASSWORD+=s
    print("your password",PASSWORD)



#generate a password using random choice and random sample
import random
a=int(input("enter noof numbers:"))
nu=int(input("enter a number:"))
spea=int(input("enter a special number:"))
alpha=random.choices('abcdefghijklmonpqrstuvwxyz',k=a)
num=random.choices('0123456789',k=nu)
spe=random.choices('!@#$%^&*()',k=spea)
m=alpha+num+spe
print("".join(m))'''
      

import pyttsx3
en=pyttsx3.init()
en.setProperty('rate',40)
voices=en.getProperty('voices')
en.setProperty('voice',voices[1].id)
en.say('Good morning')
en.runAndWait()
