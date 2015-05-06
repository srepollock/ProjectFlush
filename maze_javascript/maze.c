#include<stdio.h>
#include<stdlib.h>
#include<time.h>

#define MAPSIZE 60

int main(){
	char map[MAPSIZE][MAPSIZE/2]; /*2d map array*/
	size_t i;
	size_t j;
	
	void drawSpot(char (*map)[MAPSIZE/2], size_t x, size_t y, size_t prevDir); /*recursive function to draw a new floor space*/
	int checkSpot(char (*map)[MAPSIZE/2], size_t x, size_t y, size_t curx, size_t cury); /*checks that a space isnt blocked in before drawing a new floor there*/
	void printMap(char (*map)[MAPSIZE/2]); /*prints the map to the console*/
	
	srand(time(NULL));/*resetting the random seed, dont worry about it*/
	
	for(i=0; i<MAPSIZE/2; i++){
		for(j=0; j<MAPSIZE; j++){
			map[j][i]='.'; /*setting all spaces on the map to wall*/
		}
	}
	
	putchar('\n');
		
	
	drawSpot(map, 1,1, rand()%4);/*starts drawing the map at 1,1, with a random direction for next space*/
	
	printMap(map);/*prints final map to the console*/
	
	
	return 0;
}

/**
parameters:
	map: the maze map
	x: x coordinate of current position
	y: y coordinate of current position
	prevDir: previous direction.  This makes it more likely to draw straight for a while instead of constantly turning
	
Takes in the above, and makes the current position a floor(rather than a wall)
**/
void drawSpot(char (*map)[MAPSIZE/2], size_t x, size_t y, size_t prevDir){
	int turn; 
	size_t i;
	int dir; /*direction map is drawing*/
	
	int checkSpot(char (*map)[MAPSIZE/2], size_t x, size_t y, size_t curx, size_t cury); /*checks that a space isnt blocked in before drawing a new floor there*/		
	
	map[x][y]='#'; /*sets this spot to a floor*/
	turn = rand()%2; /*random 0 or 1, for whether it is turning left or right*/
	
	/*uncomment these if you want it to draw step by step and print each time*/
	/*printMap(map);*/
	/*usleep(100000);*/
	
	
	if(rand()%2){/*50% chance to change direction*/
		dir = rand()%4;/*randomly assigns one of the four possible directions*/
	}else{
		dir = prevDir;/*if direction isnt changed, set to previous direction.*/
	}
	
	
	/*checks if desired direction is available, and if it is calls this function on that spot, else turns to the next possible spot*/
	for(i=0; i<4; i++){
		switch(dir){
			case 0:
				if(checkSpot(map, x, y-1, x,y))drawSpot(map, x, y-1, dir);
				break;
			case 1:
				if(checkSpot(map, x, y+1, x,y))drawSpot(map, x, y+1, dir);
				break;
			case 2:
				if(checkSpot(map, x-1, y, x,y))drawSpot(map, x-1, y, dir);
				break;
			case 3:
				if(checkSpot(map, x+1, y, x,y))drawSpot(map, x+1, y, dir);
				break;
		}
		
		
		if(turn){ /*checks which rotation direction*/
			dir--;/*turns that direction*/
			if(dir<0)dir=3; /*if turns past zero, puts back at 4*/
		}else{
			dir++;
			if(dir>3)dir=0;
		}
	}
	/*if all spots have been attempted, function ends and is taken off the stack.  goes back to last function call to try and branch from there*/
}


/*Checks that the passed position is clear on all sides except the side it came from.*/
int checkSpot(char (*map)[MAPSIZE/2], size_t x, size_t y, size_t curx, size_t cury){
	size_t i;
	size_t j;
	
	if(map[x][y]=='#')return 0;/*if the spot is already a floor*/
	if(x==0||y==0)return 0;/*if its one of two the edges of the map*/
	if(x==MAPSIZE-1||y==(MAPSIZE/2)-1)return 0; /*if its one of the other two edges of the map*/
	
	for(i=y-1; i<=y+1; i++){
		for(j=x-1; j<=x+1; j++){
			if(j!=curx&&i!=cury){/*makes sure its not seeing the previous floor*/
				if(map[j][i]=='#')return 0;/*if theres a floor in any space around, do not draw*/
			}
		}
	}
	return 1;/*space not touching any floor*/
}

/*prints all the details of the current map in ascii to the console.*/
void printMap(char (*map)[MAPSIZE/2]){
	size_t i;
	size_t j;
	
	for(i=0; i<MAPSIZE/2; i++){
		for(j=0; j<MAPSIZE; j++){
			putchar(map[j][i]);
		}
		putchar('\n');
	}
	putchar('\n');
}
