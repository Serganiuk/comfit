export const FOODS=[
  // poultry / meat
  ['Chicken breast',165,31,3.6,0],['Chicken thigh',177,24,8.5,0],['Chicken wing',203,30,8,0],
  ['Chicken leg',184,25,9,0],['Whole chicken',239,27,14,0],['Turkey breast',135,30,1,0],
  ['Turkey mince',150,27,4,0],['Duck breast',201,24,11,0],['Beef steak',217,26,12,0],
  ['Ground beef',254,26,17,0],['Beef mince lean',176,20,10,0],['Pork loin',143,26,4,0],
  ['Pork chop',231,26,14,0],['Bacon',541,37,42,1.4],['Ham',145,21,6,1.5],
  ['Lamb',294,25,21,0],['Sausage',301,12,27,2],['Veal',172,24,8,0],
  // fish / seafood
  ['Salmon',208,20,13,0],['Tuna',132,28,1,0],['Canned tuna',116,26,1,0],['Cod',82,18,0.7,0],
  ['Sardines',208,25,11,0],['Mackerel',205,19,14,0],['Shrimp',99,24,0.3,0.2],
  ['Trout',141,20,6,0],['Herring',158,18,9,0],['Tilapia',96,20,1.7,0],['Crab',97,19,1.5,0],
  // eggs / dairy
  ['Egg',155,13,11,1.1],['Egg white',52,11,0.2,0.7],['Egg yolk',322,16,27,3.6],
  ['Whole milk',61,3.2,3.3,4.8],['Skim milk',34,3.4,0.1,5],['Greek yogurt',59,10,0.4,3.6],
  ['Yogurt',61,3.5,3.3,4.7],['Cottage cheese',98,11,4.3,3.4],['Cheddar',403,25,33,1.3],
  ['Mozzarella',280,28,17,3.1],['Feta',264,14,21,4],['Parmesan',431,38,29,4],
  ['Cream cheese',342,6,34,4],['Butter',717,0.9,81,0.1],['Sour cream',198,2.4,19,4.6],
  // grains / carbs
  ['Oats',389,17,7,66],['White rice',130,2.7,0.3,28],['Brown rice',123,2.7,1,26],
  ['Pasta',158,5.8,0.9,31],['Spaghetti',158,5.8,0.9,31],['Quinoa',120,4.4,1.9,21],
  ['Couscous',112,3.8,0.2,23],['Buckwheat',92,3.4,0.6,20],['White bread',265,9,3.2,49],
  ['Whole grain bread',247,13,3.4,41],['Rye bread',259,9,3.3,48],['Bagel',250,10,1.5,48],
  ['Tortilla',218,6,5,36],['Cornflakes',357,7,0.9,84],['Granola',471,10,20,64],
  ['Sweet potato',86,1.6,0.1,20],['Potato',77,2,0.1,17],['Mashed potato',83,2,1.2,15],
  ['French fries',312,3.4,15,41],['Corn',96,3.4,1.5,21],
  // legumes
  ['Lentils',116,9,0.4,20],['Chickpeas',164,9,2.6,27],['Black beans',132,9,0.5,24],
  ['Kidney beans',127,9,0.5,23],['Green peas',81,5,0.4,14],['Tofu',76,8,4.8,1.9],
  ['Edamame',121,12,5,9],['Hummus',166,8,10,14],
  // vegetables
  ['Broccoli',34,2.8,0.4,7],['Spinach',23,2.9,0.4,3.6],['Kale',49,4.3,0.9,9],
  ['Tomato',18,0.9,0.2,3.9],['Cucumber',15,0.7,0.1,3.6],['Carrot',41,0.9,0.2,10],
  ['Bell pepper',31,1,0.3,6],['Onion',40,1.1,0.1,9],['Garlic',149,6,0.5,33],
  ['Zucchini',17,1.2,0.3,3.1],['Eggplant',25,1,0.2,6],['Cauliflower',25,1.9,0.3,5],
  ['Lettuce',15,1.4,0.2,2.9],['Mushroom',22,3.1,0.3,3.3],['Green beans',31,1.8,0.2,7],
  ['Asparagus',20,2.2,0.1,3.9],['Cabbage',25,1.3,0.1,6],['Beetroot',43,1.6,0.2,10],
  ['Pumpkin',26,1,0.1,7],['Celery',16,0.7,0.2,3],
  // fruits
  ['Apple',52,0.3,0.2,14],['Banana',89,1.1,0.3,23],['Orange',47,0.9,0.1,12],
  ['Blueberry',57,0.7,0.3,14],['Strawberry',32,0.7,0.3,8],['Grapes',69,0.7,0.2,18],
  ['Watermelon',30,0.6,0.2,8],['Pineapple',50,0.5,0.1,13],['Mango',60,0.8,0.4,15],
  ['Pear',57,0.4,0.1,15],['Peach',39,0.9,0.3,10],['Kiwi',61,1.1,0.5,15],
  ['Raspberry',52,1.2,0.7,12],['Cherry',63,1.1,0.2,16],['Pomegranate',83,1.7,1.2,19],
  ['Lemon',29,1.1,0.3,9],['Grapefruit',42,0.8,0.1,11],['Avocado',160,2,15,9],
  ['Dates',277,1.8,0.2,75],['Raisins',299,3.1,0.5,79],
  // nuts / fats
  ['Almonds',579,21,50,22],['Walnuts',654,15,65,14],['Cashews',553,18,44,30],
  ['Peanuts',567,26,49,16],['Peanut butter',588,25,50,20],['Pistachios',560,20,45,28],
  ['Hazelnuts',628,15,61,17],['Chia seeds',486,17,31,42],['Flax seeds',534,18,42,29],
  ['Sunflower seeds',584,21,51,20],['Olive oil',884,0,100,0],['Coconut oil',862,0,100,0],
  // other / snacks
  ['Whey protein',400,80,7,10],['Protein bar',350,20,12,40],['Honey',304,0.3,0,82],
  ['Sugar',387,0,0,100],['Dark chocolate',546,5,31,61],['Milk chocolate',535,8,30,59],
  ['Ice cream',207,3.5,11,24],['Pizza',266,11,10,33],['Hamburger',295,17,14,24],
  ['Ketchup',101,1.2,0.1,25],['Mayonnaise',680,1,75,0.6],['Jam',278,0.4,0.1,69]
];
