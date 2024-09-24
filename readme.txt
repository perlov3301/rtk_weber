git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/perlov3301/rtk_weber.git
git push -u origin main

git revert --no-commit 3a9306e77..HEAD /**from head back
git commit
git revert --no-commit HEAD~1..HEAD/** one commit back
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png