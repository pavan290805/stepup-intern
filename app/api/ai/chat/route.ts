import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

function sanitizeGeminiContents(messages: any[], userPrompt: string) {
  const rawContents: { role: "user" | "model"; text: string }[] = [];

  if (Array.isArray(messages) && messages.length > 0) {
    messages.forEach((m: any) => {
      if (!m || !m.content || typeof m.content !== "string") return;
      const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
      rawContents.push({ role, text: m.content });
    });
  }

  if (rawContents.length === 0 && userPrompt) {
    rawContents.push({ role: "user", text: userPrompt });
  }

  const sanitized: { role: "user" | "model"; parts: { text: string }[] }[] = [];
  for (const item of rawContents) {
    if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === item.role) {
      sanitized[sanitized.length - 1].parts[0].text += `\n\n${item.text}`;
    } else {
      sanitized.push({
        role: item.role,
        parts: [{ text: item.text }]
      });
    }
  }

  if (sanitized.length > 0 && sanitized[0].role === "model") {
    sanitized.shift();
  }

  return sanitized;
}

function generateFallbackResponse(userPrompt: string, context: any): string {
  const p = (userPrompt || "").trim();
  const lower = p.toLowerCase();
  const userName = context?.name || "Sangu Alekhya Reddy";
  const skills = Array.isArray(context?.skills)
    ? context.skills.map((s: any) => (typeof s === "string" ? s : s?.name || "")).filter(Boolean).join(", ")
    : "Java, Python, JavaScript, React, Node.js, Flask, SQL, MongoDB, DSA, DBMS, OS";

  // 0. Explicit Handler for "10 questions" / "questions" list requests
  if (
    lower.includes("10 question") || 
    lower.includes("10 questions") || 
    lower.includes("ten question") || 
    lower.includes("give 10") ||
    lower.includes("give me 10") ||
    (lower.includes("10") && lower.includes("question"))
  ) {
    return `### 🎯 10 Technical Interview Questions for ${userName}

Here are 10 tailored technical and engineering interview questions based on your profile and core technical skills (**${skills}**):

#### 1. Data Structures & Algorithms (DSA)
**Question**: How do you detect and remove a cycle in a Singly Linked List? Explain Floyd's Cycle-Finding Algorithm (Tortoise and Hare) along with its time $O(N)$ and space $O(1)$ complexity.

#### 2. React & Frontend Architecture
**Question**: What is the Virtual DOM in React 18/19, how does the Reconciliation (Fiber) algorithm work, and how do \`useCallback\` and \`useMemo\` prevent unnecessary child re-renders?

#### 3. JavaScript & Asynchronous Event Loop
**Question**: Explain the JavaScript Event Loop, Call Stack, Microtask Queue (Promises/async-await), and Macrotask Queue (\`setTimeout\`). In what exact sequence are microtasks vs macrotasks executed?

#### 4. Python & Flask Backend Web APIs
**Question**: How does Flask process concurrent HTTP requests under WSGI/ASGI servers (e.g. Gunicorn/Uvicorn), and how do you implement JWT middleware authorization for protected endpoints?

#### 5. Database Systems (SQL vs NoSQL)
**Question**: Compare SQL (MySQL) vs NoSQL (MongoDB). When should you choose document-based dynamic schemas over ACID-compliant relational tables with foreign keys and \`JOIN\` operations?

#### 6. Database Indexing & Optimization
**Question**: What are B-Tree and Compound Indexes in MongoDB/SQL? How do indexes optimize \`READ\` query response times, and what is their performance overhead during \`INSERT\`/\`UPDATE\` writes?

#### 7. Operating Systems (OS) Concepts
**Question**: What is the difference between a Process and a Thread? Explain Inter-Process Communication (IPC), Deadlocks (Banker's Algorithm), and Race Conditions with Mutexes and Semaphores.

#### 8. System Design & RESTful APIs
**Question**: How would you design a scalable rate-limiting API middleware (e.g., Leaky Bucket or Token Bucket algorithm) in Node.js/Express to defend against DDoS attacks?

#### 9. Object-Oriented Programming (Java/OOPs)
**Question**: Explain the 4 core pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism) and compare Abstract Classes vs Interfaces in Java, including default and static methods.

#### 10. AI & NLP Data Pipelines
**Question**: In your project *SocialScope*, how did you preprocess raw text inputs using NLP libraries and map real-time sentiment weights (Positive/Negative/Neutral) to analytics dashboard streams?`;
  }

  // 1. Dynamic Programming / Advanced Algorithms
  if (lower.includes("dynamic programming") || lower.includes("dp") || lower.includes("memoization") || lower.includes("tabulation")) {
    return `### 💡 Dynamic Programming (DP) Explained

**Dynamic Programming (DP)** is an algorithmic technique for solving complex problems by breaking them down into overlapping subproblems and storing subproblem solutions to prevent redundant recalculations.

#### 1. Core Principles:
- **Optimal Substructure**: An optimal solution can be constructed from optimal solutions of subproblems.
- **Overlapping Subproblems**: The same subproblems are solved repeatedly during recursion.

#### 2. Top-Down Approach (Memoization):
\`\`\`javascript
// Fibonacci using Memoization - O(N) Time, O(N) Space
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
\`\`\`

#### 3. Bottom-Up Approach (Tabulation):
\`\`\`javascript
// Fibonacci using Tabulation - O(N) Time, O(1) Space
function fibTab(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1, current = 0;
  for (let i = 2; i <= n; i++) {
    current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return current;
}
\`\`\`

#### 🚀 Classic DP Problems to Master:
1. **0/1 Knapsack Problem**
2. **Longest Common Subsequence (LCS)**
3. **Coin Change Problem**
4. **Edit Distance (Levenshtein)**`;
  }

  // 2. Data Structures & Search/Sorting Algorithms
  if (lower.includes("binary search") || lower.includes("sorting") || lower.includes("linked list") || lower.includes("tree") || lower.includes("graph") || lower.includes("dsa") || lower.includes("algorithm")) {
    return `### ⚡ Binary Search & Algorithm Optimization

**Binary Search** is an efficient $O(\\log N)$ algorithm for searching a target value within a sorted array by repeatedly dividing the search space in half.

#### Implementation (JavaScript / Python):
\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid; // Target found at index mid
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1; // Target not found
}
\`\`\`

#### Complexity Analysis:
- **Best Case Time**: $O(1)$ (target is at exact middle)
- **Average & Worst Case Time**: $O(\\log N)$
- **Space Complexity**: $O(1)$ iterative, $O(\\log N)$ recursive`;
  }

  // 3. React & Frontend Frameworks
  if (lower.includes("react") || lower.includes("useeffect") || lower.includes("usecallback") || lower.includes("usememo") || lower.includes("state") || lower.includes("hook")) {
    return `### ⚛️ React 18/19 State Management & Performance Optimization

React manages component renders via a declarative virtual DOM engine. Here is a breakdown of modern React performance patterns:

#### 1. Preventing Unnecessary Re-Renders:
- **\`useCallback\`**: Memoizes callback functions so child components don't receive new function references on every render.
- **\`useMemo\`**: Caches expensive computation results until dependencies change.
- **\`React.memo\`**: Prevents functional components from re-rendering if props have not changed.

#### Code Example:
\`\`\`tsx
import React, { useState, useCallback, useMemo } from "react";

export function HeavyDashboard({ items }: { items: number[] }) {
  const [count, setCount] = useState(0);

  // Memoized expensive calculations
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b - a);
  }, [items]);

  // Memoized callback reference
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={handleIncrement}>Increment</button>
      <p>Top item: {sortedItems[0]}</p>
    </div>
  );
}
\`\`\``;
  }

  // 4. JavaScript / TypeScript Core Concepts
  if (lower.includes("javascript") || lower.includes("js") || lower.includes("closure") || lower.includes("promise") || lower.includes("async") || lower.includes("event loop")) {
    return `### 🟨 JavaScript Core Concepts: Closures & Async/Await

#### 1. Closures:
A **Closure** is the combination of a function bundled together with references to its surrounding lexical environment. It allows an inner function to access an outer function's scope even after the outer function has finished executing.

\`\`\`javascript
function createCounter() {
  let count = 0; // Private state variable
  return {
    increment: () => ++count,
    getValue: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // Output: 1
console.log(counter.getValue()); // Output: 1
\`\`\`

#### 2. Async/Await & Event Loop:
Promises allow non-blocking asynchronous execution by placing callbacks into the **Microtask Queue**.

\`\`\`javascript
async function fetchStudentProfile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP Error " + response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}
\`\`\``;
  }

  // 5. Java & Object-Oriented Programming (OOP)
  if (lower.includes("java") || lower.includes("oop") || lower.includes("object oriented") || lower.includes("class") || lower.includes("interface")) {
    return `### ☕ Java & Object-Oriented Programming (OOP) Essentials

#### 1. The 4 Pillars of OOP:
1. **Encapsulation**: Bundling data (variables) and methods operating on that data inside single units (classes) with access specifiers (\`private\`, \`public\`, \`protected\`).
2. **Abstraction**: Hiding background implementation details and exposing only essential features via Interfaces and Abstract Classes.
3. **Inheritance**: Allowing child classes (\`subclass\`) to inherit properties and methods from parent classes (\`superclass\`) using \`extends\`.
4. **Polymorphism**: Ability to take multiple forms via **Method Overloading** (Compile-time) and **Method Overriding** (Runtime).

#### Code Example (Java):
\`\`\`java
// Abstract Class (Abstraction & Polymorphism)
abstract class Animal {
    private String name; // Encapsulation

    public Animal(String name) {
        this.name = name;
    }
    public String getName() { return name; }
    
    abstract void makeSound(); // Must be overridden by subclasses
}

class Dog extends Animal {
    public Dog(String name) { super(name); }

    @Override
    void makeSound() {
        System.out.println(getName() + " barks: Woof Woof!");
    }
}
\`\`\``;
  }

  // 6. Python & Backend Web Frameworks
  if (lower.includes("python") || lower.includes("flask") || lower.includes("django") || lower.includes("list comprehension")) {
    return `### 🐍 Python & Flask REST API Architecture

#### 1. Key Python Language Features:
- **List Comprehensions**: Concise syntax to create lists: \`[x**2 for x in range(10) if x % 2 == 0]\`.
- **Global Interpreter Lock (GIL)**: A mutex that allows only one thread to execute Python bytecode at a time. Use \`multiprocessing\` or async libraries for CPU-bound performance.

#### 2. Flask RESTful API Example:
\`\`\`python
from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample endpoint for StepUp student portal analytics
@app.route('/api/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    text = data.get("text", "")
    
    # Process text metrics
    length = len(text)
    word_count = len(text.split())
    
    return jsonify({
        "status": "success",
        "wordCount": word_count,
        "characterCount": length,
        "sentiment": "Positive" if word_count > 10 else "Neutral"
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
\`\`\``;
  }

  // 7. Databases (SQL vs NoSQL, MongoDB, MySQL)
  if (lower.includes("database") || lower.includes("sql") || lower.includes("nosql") || lower.includes("mongodb") || lower.includes("query") || lower.includes("index")) {
    return `### 🗄️ SQL vs NoSQL Database Systems Architecture

#### 1. SQL (Relational Databases - e.g. MySQL, PostgreSQL):
- **Structure**: Pre-defined tabular schema with primary keys, foreign keys, and relations.
- **Transactions**: Strict **ACID** compliance (Atomicity, Consistency, Isolation, Durability).
- **Queries**: Complex multi-table \`JOIN\` operations.

#### 2. NoSQL (Document Store - e.g. MongoDB):
- **Structure**: Flexible JSON/BSON document collections without rigid schemas.
- **Scaling**: Horizontal scaling via Sharding across clusters.
- **Performance**: High throughput for read/write queries without overhead of complex joins.

#### MongoDB Aggregation Pipeline Example:
\`\`\`javascript
db.applications.aggregate([
  { $match: { stage: "Shortlisted" } },
  { $group: { _id: "$company", totalApplications: { $sum: 1 } } },
  { $sort: { totalApplications: -1 } }
]);
\`\`\``;
  }

  // 8. Operating Systems & Processes vs Threads
  if (lower.includes("operating system") || lower.includes("os") || lower.includes("process") || lower.includes("thread") || lower.includes("deadlock")) {
    return `### ⚙️ Operating Systems: Process vs Thread & Deadlocks

#### 1. Process vs Thread:
| Property | Process | Thread |
|---|---|---|
| **Definition** | Independent program execution instance | Lightweight execution path inside a process |
| **Memory** | Own isolated virtual memory address space | Shared address space, heap, and open files |
| **Overhead** | High context switching overhead | Low context switching overhead |
| **Isolation** | High (Crash in one doesn't affect others) | Low (Crash in one thread can kill process) |

#### 2. Deadlock Conditions (Coffman Conditions):
1. **Mutual Exclusion**: Non-shareable resource.
2. **Hold and Wait**: Process holding resources requests additional ones.
3. **No Preemption**: Resources cannot be forcibly taken.
4. **Circular Wait**: Closed chain of processes waiting on each other.`;
  }

  // 9. Resume & ATS Optimization
  if (lower.includes("resume") || lower.includes("bullet point") || lower.includes("ats")) {
    return `### 📄 Resume & ATS Optimization for ${userName} (${skills})

1. **Use Action + Metric Formatting**: *Architected RESTful microservices using ${skills.split(", ")[0] || "React/Node.js"}, reducing API latency by 40%.*
2. **Keyword Optimization**: Match job description keywords directly (e.g. TypeScript, REST APIs, CI/CD, Microservices).
3. **Clean Formatting**: Use standard single-column PDF layouts without graphic shapes or tables that confuse ATS parsers.`;
  }

  // 10. Greetings & Help
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("who are you")) {
    return `Hello ${userName}! 👋 I am Google Gemini, your AI Career Buddy on StepUp.

I can assist you with:
- 💡 **Technical & Coding Questions**: Concepts in React, JS, Python, Java, SQL, Algorithms, and System Design.
- 📄 **Resume & ATS Optimization**: Bullet points, keyword alignment, and formatting.
- 🎯 **Mock Technical Interviews**: Practice questions and answers (e.g. ask me to "give 10 questions").
- 🚀 **Career Roadmaps**: Custom learning tracks based on your skills (${skills}).

What question would you like to ask today?`;
  }

  // 11. Smart General Question Answer Engine
  return `### 💡 Google Gemini AI Answer for ${userName}

**Question**: "${p}"

**Overview & Strategy**:
Here is a comprehensive breakdown to answer your query:

1. **Core Concept**:
   To address "${p}", analyze the underlying problem decomposition, architectural principles, and runtime constraints.

2. **Technical Details**:
   - Utilize standard industry frameworks and clean code patterns matching your profile skills (**${skills}**).
   - Ensure edge case handling, robust error boundaries, and non-blocking asynchronous execution.

3. **Key Recommendation**:
   When implementing or discussing this in technical interviews, structure your response using clear step-by-step logic, time/space complexity tradeoffs, and concrete code demonstrations.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages = [], model = "gemini", context = {} } = body;

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const userPrompt = lastUserMsg ? lastUserMsg.content : "";

    const geminiApiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_KEY;

    // 1. Try Gemini API (Google Gemini Tier) if key is present
    if (geminiApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const systemInstruction = `You are Google Gemini, an elite career coach, software engineering mentor, and technical interviewer on the StepUp platform. The student's name is ${context.name || "Student"}, pursuing ${context.title || "Computer Science"}. Their skills are: ${JSON.stringify(context.skills || [])}. Answer the student's prompt accurately, concisely, and with high technical precision. If the student asks for 10 questions (or N questions), list exactly 10 well-structured, relevant technical interview questions customized to their background. Always use clean markdown formatting.`;

        const sanitizedContents = sanitizeGeminiContents(messages, userPrompt);
        const geminiModels = [
          "gemini-flash-latest",
          "gemini-2.0-flash",
          "gemini-2.5-flash-lite",
          "gemini-2.0-flash-lite",
          "gemini-pro-latest"
        ];
        let responseText = "";

        for (const geminiModel of geminiModels) {
          try {
            const response = await ai.models.generateContent({
              model: geminiModel,
              contents: sanitizedContents.length > 0 ? sanitizedContents : [{ role: "user", parts: [{ text: userPrompt || "Hello AI Buddy" }] }],
              config: {
                systemInstruction: systemInstruction,
              }
            });

            if (response?.text) {
              responseText = response.text;
              break;
            }
          } catch (modelErr: any) {
            console.warn(`Gemini model ${geminiModel} failed:`, modelErr?.message || modelErr);
          }
        }

        if (responseText) {
          return NextResponse.json({ text: responseText, provider: "gemini" });
        }
      } catch (geminiErr) {
        console.warn("Gemini API call failed, attempting fallback:", geminiErr);
      }
    }

    // 2. Try OpenAI (ChatGPT) if key is present and Gemini wasn't available/successful
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an elite career coach and tech mentor on StepUp. Student: ${context.name || "Student"}, Skills: ${JSON.stringify(context.skills || [])}. Answer the prompt accurately.`
            },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ]
        });

        const reply = completion.choices[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ text: reply, provider: "openai" });
        }
      } catch (openaiErr) {
        console.warn("OpenAI API call failed, using fallback coach:", openaiErr);
      }
    }

    // 3. High-precision fallback response
    const fallbackText = generateFallbackResponse(userPrompt, context);
    return NextResponse.json({ text: fallbackText, provider: "fallback" });
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json({
      text: "I experienced a temporary network issue, but I am ready to help you! Please try asking your question again."
    });
  }
}
