export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
};

export type LessonContent = {
  missionId: number;
  youtubeId: string;
  explanation: string;
};

export type QuizContent = {
  missionId: number;
  questions: QuizQuestion[];
};

export type CodingContent = {
  missionId: number;
  problem: string;
  starterCode: string;
  hint: string;
  sampleOutput: string;
};

export const LESSON_CONTENT: Record<number, LessonContent> = {
  2: {
    missionId: 2,
    youtubeId: "rfscVS0vtbw",
    explanation: `Programming is the process of giving computers instructions to perform tasks. In this lesson you'll learn:
    
**Core Concepts:**
- **Algorithms**: Step-by-step instructions to solve a problem
- **Variables**: Named containers for storing data (e.g. \`x = 5\`)
- **Control Flow**: Deciding what code runs when (if/else)
- **Loops**: Repeating code multiple times (for, while)
- **Functions**: Reusable blocks of code that perform a specific task

**Why Python?**
Python is one of the most beginner-friendly programming languages. It reads almost like English and is used in web development, data science, AI, and more.

**Your First Program:**
\`\`\`python
print("Hello, World!")
name = "EduQuest"
print(f"Welcome to {name}!")
\`\`\`

Complete this lesson to earn 10 XP and unlock the Python universe!`,
  },
  3: {
    missionId: 3,
    youtubeId: "khKv-8q7YmY",
    explanation: `Variables are one of the most fundamental concepts in programming. They let you store, access, and manipulate data.

**Data Types in Python:**

| Type | Example | Description |
|------|---------|-------------|
| \`int\` | \`42\` | Whole numbers |
| \`float\` | \`3.14\` | Decimal numbers |
| \`str\` | \`"hello"\` | Text strings |
| \`bool\` | \`True\` | True or False |
| \`list\` | \`[1, 2, 3]\` | Ordered collection |

**Examples:**
\`\`\`python
age = 20          # int
gpa = 3.85        # float
name = "Alex"     # str
is_student = True # bool
scores = [95, 87, 92]  # list
\`\`\`

**Type Conversion:**
\`\`\`python
num_str = "42"
num_int = int(num_str)   # "42" → 42
num_float = float(num_str) # "42" → 42.0
\`\`\`

Understanding data types helps you write bug-free code and choose the right tool for each job!`,
  },
  5: {
    missionId: 5,
    youtubeId: "8mei0BUyhMI",
    explanation: `Algorithms are the heart of computer science. An algorithm is a finite set of clear instructions for solving a problem.

**Key Algorithm Concepts:**

**1. Time Complexity (Big O)**
- O(1) — Constant time: same speed regardless of input
- O(n) — Linear time: speed grows with input size  
- O(n²) — Quadratic time: nested loops
- O(log n) — Logarithmic time: binary search

**2. Sorting Algorithms:**
\`\`\`python
# Bubble Sort — O(n²)
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Python's built-in sort — O(n log n) Timsort
numbers = [64, 34, 25, 12, 22]
numbers.sort()  # Much faster!
\`\`\`

**3. Searching:**
\`\`\`python
# Linear Search — O(n)
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Binary Search — O(log n), requires sorted array
import bisect
pos = bisect.bisect_left(sorted_arr, target)
\`\`\`

Master these fundamentals to write efficient programs!`,
  },
  6: {
    missionId: 6,
    youtubeId: "JeznW_7DlB0",
    explanation: `Object-Oriented Programming (OOP) is a paradigm that organizes code around objects — bundles of data and behavior.

**The 4 Pillars of OOP:**

**1. Encapsulation** — Bundling data and methods together
\`\`\`python
class Student:
    def __init__(self, name, xp=0):
        self.name = name
        self._xp = xp  # "private" attribute
    
    def earn_xp(self, amount):
        self._xp += amount
        return self._xp
\`\`\`

**2. Inheritance** — Deriving new classes from existing ones
\`\`\`python
class GradStudent(Student):
    def __init__(self, name, thesis_topic):
        super().__init__(name)
        self.thesis_topic = thesis_topic
\`\`\`

**3. Polymorphism** — Same method, different behavior
\`\`\`python
class Shape:
    def area(self): return 0

class Circle(Shape):
    def area(self): return 3.14 * self.radius ** 2

class Square(Shape):
    def area(self): return self.side ** 2
\`\`\`

**4. Abstraction** — Hiding implementation details
\`\`\`python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self): pass

class Dog(Animal):
    def speak(self): return "Woof!"
\`\`\`

OOP makes your code modular, reusable, and easier to maintain!`,
  },
  7: {
    missionId: 7,
    youtubeId: "GwIo3gDZCVQ",
    explanation: `Machine Learning (ML) is a subset of AI where systems learn patterns from data without being explicitly programmed.

**Types of Machine Learning:**

**1. Supervised Learning** — Learns from labeled examples
- Classification: predict categories (spam/not spam)
- Regression: predict numbers (house prices)

**2. Unsupervised Learning** — Finds hidden patterns in unlabeled data
- Clustering: group similar data points
- Dimensionality reduction: compress data

**3. Reinforcement Learning** — Learns by trial and error with rewards

**The ML Pipeline:**
\`\`\`python
# 1. Collect & prepare data
import pandas as pd
df = pd.read_csv("data.csv")

# 2. Split into train/test
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 3. Choose & train a model
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)

# 4. Evaluate
score = model.score(X_test, y_test)
print(f"R² Score: {score:.3f}")
\`\`\`

**Key Metrics:**
- Accuracy, Precision, Recall (Classification)
- MAE, RMSE, R² (Regression)

The future belongs to those who understand ML!`,
  },
  9: {
    missionId: 9,
    youtubeId: "ysEN5RaKOlA",
    explanation: `Data preprocessing is often 80% of the work in any ML or data science project. Raw data is messy — your job is to clean it.

**Common Data Problems & Solutions:**

**1. Missing Values**
\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv("dataset.csv")

# Check missing values
print(df.isnull().sum())

# Strategy 1: Drop rows with missing values
df_clean = df.dropna()

# Strategy 2: Fill with mean/median
df['age'].fillna(df['age'].mean(), inplace=True)

# Strategy 3: Fill categorical with mode
df['city'].fillna(df['city'].mode()[0], inplace=True)
\`\`\`

**2. Normalization & Scaling**
\`\`\`python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Standardization (mean=0, std=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Min-Max Normalization (range 0-1)
minmax = MinMaxScaler()
X_normalized = minmax.fit_transform(X)
\`\`\`

**3. Encoding Categorical Variables**
\`\`\`python
# One-Hot Encoding
df_encoded = pd.get_dummies(df, columns=['category'])

# Label Encoding
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])
\`\`\`

**4. Feature Engineering**
\`\`\`python
# Create new features from existing ones
df['age_group'] = pd.cut(df['age'], bins=[0, 18, 35, 60, 100], 
                          labels=['teen', 'young', 'adult', 'senior'])
\`\`\`

Clean data = better models = better predictions!`,
  },
  11: {
    missionId: 11,
    youtubeId: "aircAruvnKk",
    explanation: `Neural networks are the backbone of modern AI. Inspired by the human brain, they consist of layers of interconnected "neurons."

**Architecture:**
\`\`\`
Input Layer → Hidden Layers → Output Layer
[Features]      [Learning]     [Predictions]
\`\`\`

**Key Concepts:**

**1. Neurons & Weights**
Each neuron computes: \`output = activation(sum(inputs * weights) + bias)\`

**2. Activation Functions**
\`\`\`python
import numpy as np

# ReLU: max(0, x) — most common
def relu(x): return np.maximum(0, x)

# Sigmoid: 1/(1+e^-x) — for binary classification
def sigmoid(x): return 1 / (1 + np.exp(-x))

# Softmax — for multi-class classification
def softmax(x): return np.exp(x) / np.sum(np.exp(x))
\`\`\`

**3. Training (Backpropagation)**
\`\`\`python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=10, batch_size=32)
\`\`\`

**Types of Neural Networks:**
- **CNN** (Convolutional) — Images & vision
- **RNN/LSTM** — Sequential data, text, time series
- **Transformers** — NLP, GPT, BERT

The deeper the network, the more complex the patterns it can learn!`,
  },
  13: {
    missionId: 13,
    youtubeId: "xxpc-HPKN28",
    explanation: `Statistics is the mathematical foundation of data science and machine learning. Without it, you can't truly understand your data.

**Descriptive Statistics:**
\`\`\`python
import pandas as pd
import numpy as np

data = [12, 15, 18, 22, 25, 28, 30, 35, 40, 100]

mean = np.mean(data)        # Average: 32.5
median = np.median(data)    # Middle value: 26.5
std = np.std(data)          # Spread: how data varies
variance = np.var(data)     # Squared spread

# Pandas makes this easy:
df = pd.DataFrame({'values': data})
print(df.describe())  # All stats at once!
\`\`\`

**Probability Distributions:**
\`\`\`python
from scipy import stats

# Normal (Gaussian) distribution
x = np.linspace(-3, 3, 100)
normal_pdf = stats.norm.pdf(x, loc=0, scale=1)

# Checking if data is normally distributed
stat, p_value = stats.shapiro(data)
print(f"Normal? p-value = {p_value:.4f}")
\`\`\`

**Hypothesis Testing:**
\`\`\`python
# T-test: compare means of two groups
group_a = [85, 90, 78, 92, 88]
group_b = [79, 85, 82, 88, 90]

t_stat, p_val = stats.ttest_ind(group_a, group_b)
print(f"p-value: {p_val:.4f}")
print("Significant difference!" if p_val < 0.05 else "No significant difference")
\`\`\`

**Correlation:**
\`\`\`python
corr = df.corr()  # Pearson correlation matrix
# Values: -1 (inverse) to 0 (no relation) to +1 (direct relation)
\`\`\`

Statistics gives you the power to make evidence-based decisions!`,
  },
  14: {
    missionId: 14,
    youtubeId: "VMj-3S1tku0",
    explanation: `Deep Learning takes neural networks further by using many layers (hence "deep") to learn hierarchical representations.

**Convolutional Neural Networks (CNNs) — For Images:**
\`\`\`python
import tensorflow as tf

model = tf.keras.Sequential([
    # Convolutional layers extract features
    tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    tf.keras.layers.MaxPooling2D((2,2)),
    tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2,2)),
    # Fully connected layers classify
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])
\`\`\`

**Recurrent Neural Networks (RNNs/LSTMs) — For Sequences:**
\`\`\`python
model = tf.keras.Sequential([
    tf.keras.layers.LSTM(128, return_sequences=True, input_shape=(seq_len, features)),
    tf.keras.layers.LSTM(64),
    tf.keras.layers.Dense(1)
])
\`\`\`

**Transfer Learning — Use Pre-trained Models:**
\`\`\`python
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3), 
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False  # Freeze pretrained weights

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(num_classes, activation='softmax')
])
\`\`\`

**Transformers — The Power Behind ChatGPT:**
Self-attention mechanism allows models to focus on relevant parts of input sequences. This architecture powers BERT, GPT, and virtually all modern LLMs.

Deep Learning is changing every field — from medicine to autonomous vehicles!`,
  },
};

export const QUIZ_CONTENT: Record<number, QuizContent> = {
  1: {
    missionId: 1,
    questions: [
      {
        question: "What is the correct way to declare a variable in Python?",
        options: ["var x = 5", "int x = 5", "x = 5", "declare x = 5"],
        correct: 2,
      },
      {
        question: "Which of the following is a valid Python list?",
        options: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "<1, 2, 3>"],
        correct: 2,
      },
      {
        question: "What does the `len()` function do?",
        options: ["Converts to string", "Returns number of items", "Deletes a variable", "Creates a loop"],
        correct: 1,
      },
      {
        question: "Which keyword is used to define a function in Python?",
        options: ["func", "function", "define", "def"],
        correct: 3,
      },
      {
        question: "What is the output of `print(2 ** 3)`?",
        options: ["6", "8", "23", "5"],
        correct: 1,
      },
    ],
  },
  4: {
    missionId: 4,
    questions: [
      {
        question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
        options: ["Queue", "Linked List", "Stack", "Binary Tree"],
        correct: 2,
      },
      {
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correct: 2,
      },
      {
        question: "Which of the following is NOT a linear data structure?",
        options: ["Array", "Linked List", "Binary Tree", "Queue"],
        correct: 2,
      },
      {
        question: "In a Binary Search Tree (BST), which traversal gives sorted output?",
        options: ["Pre-order", "Post-order", "Level-order", "In-order"],
        correct: 3,
      },
      {
        question: "What is the average time complexity of quicksort?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
        correct: 1,
      },
    ],
  },
  8: {
    missionId: 8,
    questions: [
      {
        question: "Which scikit-learn class is used for linear regression?",
        options: ["LogisticRegression", "LinearRegression", "SVM", "KNeighbors"],
        correct: 1,
      },
      {
        question: "What does `train_test_split` do?",
        options: [
          "Trains the model",
          "Splits data into training and testing sets",
          "Normalizes the data",
          "Evaluates model performance",
        ],
        correct: 1,
      },
      {
        question: "Which metric is used to evaluate classification models?",
        options: ["R² Score", "MAE", "Accuracy", "RMSE"],
        correct: 2,
      },
      {
        question: "What is overfitting?",
        options: [
          "Model performs poorly on training data",
          "Model is too simple",
          "Model performs well on training but poorly on test data",
          "Model uses too little data",
        ],
        correct: 2,
      },
      {
        question: "Which algorithm is an ensemble method?",
        options: ["K-Nearest Neighbors", "Linear Regression", "Random Forest", "Logistic Regression"],
        correct: 2,
      },
    ],
  },
  13: {
    missionId: 13,
    questions: [
      {
        question: "What is the mean of the dataset [2, 4, 6, 8, 10]?",
        options: ["5", "6", "7", "4"],
        correct: 1,
      },
      {
        question: "In hypothesis testing, what does a p-value < 0.05 typically indicate?",
        options: [
          "The null hypothesis is true",
          "The result is statistically significant",
          "The sample size is too small",
          "The data is normally distributed",
        ],
        correct: 1,
      },
      {
        question: "Which measure of central tendency is most resistant to outliers?",
        options: ["Mean", "Mode", "Median", "Variance"],
        correct: 2,
      },
      {
        question: "What does a correlation coefficient of -0.9 indicate?",
        options: [
          "Weak positive correlation",
          "No correlation",
          "Strong positive correlation",
          "Strong negative correlation",
        ],
        correct: 3,
      },
      {
        question: "What is the standard deviation a measure of?",
        options: [
          "Central tendency of data",
          "Spread or dispersion of data",
          "Number of data points",
          "Minimum value in data",
        ],
        correct: 1,
      },
    ],
  },
};

export const CODING_CONTENT: Record<number, CodingContent> = {
  10: {
    missionId: 10,
    problem: `# AI Mini Project Challenge 🤖

## Problem Statement

Build an AI-powered **Student Grade Predictor** using machine learning!

### Your Task:
1. Create sample student data with study hours and test scores
2. Train a Linear Regression model to predict grades
3. Make predictions for new students
4. Print the model's accuracy score

### Requirements:
- Use \`pandas\` for data creation  
- Use \`sklearn\` for the ML model
- Predict grades for students with 3, 6, and 9 hours of study
- Print accuracy (R² score)

### Expected Output:
\`\`\`
Model R² Score: 0.xx
Students studying 3 hours: predicted grade ~xx
Students studying 6 hours: predicted grade ~xx  
Students studying 9 hours: predicted grade ~xx
\`\`\``,
    starterCode: `import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

# Step 1: Create sample dataset
data = {
    'study_hours': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'grade': [45, 55, 60, 65, 70, 75, 80, 85, 90, 95]
}
df = pd.DataFrame(data)

# Step 2: Prepare features and target
X = df[['study_hours']]
y = df['grade']

# Step 3: Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Train the model
# TODO: Create and train a LinearRegression model


# Step 5: Evaluate and predict
# TODO: Print the R² score and predictions for 3, 6, and 9 hours of study
`,
    hint: "Create a LinearRegression(), call .fit(X_train, y_train), then use .score() and .predict()",
    sampleOutput: "Model R² Score: ~0.99\nStudying 3hrs → grade ~60\nStudying 6hrs → grade ~75\nStudying 9hrs → grade ~90",
  },
  12: {
    missionId: 12,
    problem: `# Web Scraping Challenge 🕷️

## Problem Statement

Build a **web scraper** that extracts and processes data!

### Your Task:
Simulate a web scraping workflow by:
1. Creating a mock dataset representing scraped product data
2. Cleaning and processing the data (handle missing values, convert prices)
3. Finding the top 3 most expensive products
4. Computing average price by category
5. Saving results to a summary

### Requirements:
- Use \`pandas\` for data processing
- Clean the 'price' column (remove '$' signs and convert to float)
- Handle None/missing values
- Print summary statistics

### Expected Output:
\`\`\`
Top 3 Most Expensive Products:
  name        price   category
  ...

Average Price by Category:
  Electronics: $xxx.xx
  Books: $xx.xx
  Clothing: $xx.xx
\`\`\``,
    starterCode: `import pandas as pd
import numpy as np

# Simulated scraped data (as if from a website)
scraped_data = [
    {"name": "Laptop Pro", "price": "$1299.99", "category": "Electronics", "rating": 4.5},
    {"name": "Python Book", "price": "$49.99", "category": "Books", "rating": 4.8},
    {"name": "Wireless Headphones", "price": "$199.99", "category": "Electronics", "rating": 4.2},
    {"name": "Data Science Guide", "price": "$39.99", "category": "Books", "rating": 4.6},
    {"name": "Smart Watch", "price": "$299.99", "category": "Electronics", "rating": 4.0},
    {"name": "T-Shirt", "price": "$24.99", "category": "Clothing", "rating": 3.8},
    {"name": "Gaming Mouse", "price": None, "category": "Electronics", "rating": 4.3},
    {"name": "Jeans", "price": "$59.99", "category": "Clothing", "rating": 4.1},
    {"name": "ML Textbook", "price": "$79.99", "category": "Books", "rating": 4.9},
    {"name": "Bluetooth Speaker", "price": "$89.99", "category": "Electronics", "rating": 4.4},
]

# Step 1: Create DataFrame
df = pd.DataFrame(scraped_data)

# Step 2: Clean price column (remove '$' and convert to float)
# TODO: Clean the price column and handle None values


# Step 3: Find top 3 most expensive products
# TODO: Print top 3 products by price


# Step 4: Average price by category
# TODO: Print average price for each category
`,
    hint: "Use df['price'].str.replace('$', '').astype(float) to clean prices, then dropna() for missing values",
    sampleOutput: "Top 3: Laptop Pro $1299.99, Smart Watch $299.99, Wireless Headphones $199.99",
  },
  15: {
    missionId: 15,
    problem: `# Capstone Project: End-to-End Data Science 🏆

## The Ultimate Challenge

Build a complete **Sentiment Analysis Pipeline** — from raw data to predictions!

### Your Task:
1. Create a dataset of customer reviews with sentiment labels
2. Preprocess text (lowercase, remove punctuation)
3. Convert text to numerical features using CountVectorizer
4. Train a Naive Bayes classifier
5. Evaluate the model and predict sentiment on new reviews
6. Print accuracy and a classification report

### New Reviews to Classify:
- "This product is absolutely amazing!"
- "Terrible experience, would not recommend"
- "It's okay, nothing special"

### Expected Output:
\`\`\`
Model Accuracy: X.XX
Classification Report:
  precision  recall  f1-score ...

Predictions:
  "This product is amazing" → Positive
  "Terrible experience" → Negative  
  "It's okay" → Neutral
\`\`\``,
    starterCode: `import pandas as pd
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Dataset
reviews = [
    ("This product is absolutely fantastic!", "positive"),
    ("Amazing quality, very happy with my purchase", "positive"),
    ("Best purchase I've ever made!", "positive"),
    ("Love it! Works perfectly", "positive"),
    ("Exceeded my expectations completely", "positive"),
    ("Terrible product, complete waste of money", "negative"),
    ("Broken on arrival, very disappointing", "negative"),
    ("Would not recommend to anyone", "negative"),
    ("Awful quality, returned immediately", "negative"),
    ("Worst purchase ever made", "negative"),
    ("It's okay, nothing special", "neutral"),
    ("Average product, does the job", "neutral"),
    ("Neither good nor bad, just okay", "neutral"),
    ("Pretty standard, meets basic needs", "neutral"),
    ("Fine for the price, I suppose", "neutral"),
]

df = pd.DataFrame(reviews, columns=['text', 'sentiment'])

# Step 1: Preprocess text
def preprocess(text):
    # TODO: Convert to lowercase and remove punctuation using regex
    pass

df['clean_text'] = df['text'].apply(preprocess)

# Step 2: Convert text to features
vectorizer = CountVectorizer()
# TODO: Fit and transform the cleaned text

# Step 3: Split and train
# TODO: Split data, train MultinomialNB model

# Step 4: Evaluate
# TODO: Print accuracy and classification report

# Step 5: Predict new reviews
new_reviews = [
    "This product is absolutely amazing!",
    "Terrible experience, would not recommend",
    "It's okay, nothing special"
]
# TODO: Predict and print results for each new review
`,
    hint: "Use re.sub(r'[^\\w\\s]', '', text.lower()) for preprocessing, then vectorizer.fit_transform(df['clean_text'])",
    sampleOutput: "Accuracy: ~0.80+, all 3 new reviews correctly classified",
  },
};

export function getMissionContent(missionId: number, missionType: string) {
  if (missionType === "lesson") return LESSON_CONTENT[missionId] || null;
  if (missionType === "quiz") return QUIZ_CONTENT[missionId] || null;
  if (missionType === "project") return CODING_CONTENT[missionId] || null;
  return null;
}
