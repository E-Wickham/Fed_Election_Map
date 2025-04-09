import re

with open('markup.txt', 'r') as file:
    lines = file.read()
    #print(lines)
    newlines = lines
    f = open( 'new_markup.txt', 'w' )

    #make a loop and add a 
    for x in range(343):
        print(x+1)
        newSubStr = f'<path id="riding_{x+1}" onclick=info_show(this,{x+1}) d'
        newlines = re.sub("<path d", newSubStr, newlines, count=1)
        print(newSubStr)
    f.write( newlines )
    f.close()



