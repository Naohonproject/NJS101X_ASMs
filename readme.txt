- manager account : 
    email : ltb.199x@outlook.com
    password : 111111
- Staff Account :
    email : Letuanbao27121996@gmail.com
    password : 123456

    email : letuanbao@mbg8.onmicrosoft.com
    password : 123456

Heroku App Deploy Url : https://funix-njs101x-asm.herokuapp.com/


Note that, when develop the app , we save the image files in the local computer , so that when we push source to github
then Deploy on heroku,these image will be static ,in db we just store the path to the images folder
not be update util we push new commit with new image in local repo to git hub repo.
so that if we try to update the image in app deployed on heroku, may be crash app because after update we try to unlink the file that not 
exist in github repo.I will try to fix this bug.Thank for reading.