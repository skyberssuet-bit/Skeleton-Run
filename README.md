# Skeleton Run

hii!! i wanted to make a running game like that dinosaur game on chrome but spooky.

## what is it about

its halloween night and a skeleton is LATE for the graveyard party. he runs by himself (he really wants to get there) but he cant jump over tombstones on his own, so thats your job. help him get as far as possible without crashing into a tombstone!!

## how to play

1. press jump to start the game
2. the skeleton runs on his own. you just have to jump!
   - **space bar**, **up arrow** or **W** on a keyboard
   - or **click / tap** the screen
3. jump over the **tombstones**. there are small ones, tall ones with RIP on them and double ones that are right next to each other
4. if you touch a tombstone its game over
5. grab the floating **pumpkins** for **+5 points**. you have to jump kinda high to get them so time it right
6. your score goes up the longer you survive
7. the longer you run the faster he goes so it gets really hard. the best score shows up when you lose
8. press jump again to try again (theres a tiny wait first so you dont restart by accident when you smash the space bar)


## how i made it

i used the Ghost Ship guide for the `state` idea (`'start'`, `'play'` and `'over'`) and the background and then i made everything else myself:

- **the skeleton:** drawn only with `line()` and `ellipse()`. the bones are lines (spine, ribs, arms, legs), the skull is an ellipse with two dark eyes, a triangle nose and little lines for teeth. when he runs his legs swing using `sin()` and when hes in the air they stay apart
- **jumping:** i learned about gravity for this one!! every frame i add `0.8` to his `vy` (speed going down) and then add `vy` to his `y`. when you jump i set `vy` to `-14` so he shoots up and then gravity pulls him back. when his `y` gets to the ground i stop him
- **obstacles:** every tombstone is an object like `{ x, type, w, h }` kept in an array called `obstacles`. they move left every frame by `speed`. when they go off the screen i delete them with `splice()`
- **random stuff:** `random()` decides which tombstone shows up and how long to wait for the next one (i made sure there is always enough space to land between them)
- **crashing:** `hitsSkeleton()` checks if the skeleton's box overlaps with the tombstone's box. i made the boxes a tiny bit smaller than they look so it feels fair
- **pumpkins:** they float in the air and bob up and down with `sin()`. i use `dist()` to check if the skeleton touched one
- **getting faster:** `speed` starts at 5 and goes up as `distance` goes up. i used `min()` so it never goes faster than 11 or it would be impossible
- **the scene:** moon with craters, stars, bats that flap their wings, and fog. the ground has little lines that scroll by and there are dark tombstone shapes in the back that move slower than the front ones so it looks like its far away (i googled that, its called parallax)
- **when you lose:** the skeleton explodes into little bone squares (particles again) and the screen flashes red for a sec

## things that went wrong

- the first time the skeleton just flew off the top of the screen forever because i forgot to stop the gravity when he lands. now there is an `if` for the ground
- the tombstones sometimes spawned right next to each other so you couldnt jump over both. i fixed it by making the wait time never go below 50 frames
- the skeleton kept getting hit when he was clearly jumping over a tombstone. the boxes were too big so i made them smaller
- the page scrolled down when i pressed space. putting `return false` in `keyPressed()` fixed it

## how to run it

**easy way:** open the link to the game and press space

**p5.js editor way:**
1. go to [editor.p5js.org](https://editor.p5js.org/)
2. paste everything from `sketch.js` into the editor
3. press the play button
