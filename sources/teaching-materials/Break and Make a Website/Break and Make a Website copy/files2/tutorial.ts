// ============================================
// INTERACTIVE SQL TUTORIAL - TYPESCRIPT VERSION
// ============================================
// This file does the same thing as tutorial.js, but uses TypeScript
// TypeScript adds "types" to JavaScript, helping prevent errors and making code clearer

// ============================================
// WHAT IS TYPESCRIPT?
// ============================================
// TypeScript is JavaScript + Types
// 
// Think of types as labels that describe what kind of data you're working with:
// - A number like 42
// - A string of text like "hello"
// - True/false (boolean)
// - More complex objects like {name: "Alice", age: 20}
//
// Why use TypeScript?
// 1. Catches errors before you run the code
// 2. Makes code easier to understand
// 3. Helps editors give you better suggestions
// 4. Makes working with other developers easier

// ============================================
// TYPE DEFINITIONS
// ============================================
// In TypeScript, we define the "shape" of our data using types and interfaces
// This is like creating a template or blueprint

// INTERFACE EXPLAINED:
// An interface describes the structure of an object
// It says: "Objects of this type must have these properties"

/**
 * Student interface
 * Describes what a student object looks like
 */
interface Student {
    id: number;           // id must be a number
    name: string;         // name must be text (string)
    age: number;          // age must be a number
    grade: number;        // grade must be a number
}

/**
 * Course interface
 * Describes what a course object looks like
 */
interface Course {
    id: number;
    name: string;
    instructor: string;
    credits: number;
}

/**
 * QueryResult interface
 * Describes the structure of SQL query results
 */
interface QueryResult {
    columns: string[];    // Array of column names (strings)
    values: any[][];      // 2D array of values (any type)
}

// TYPE ALIAS EXPLAINED:
// A type alias gives a name to a type
// DatabaseStatus can only be one of these three strings
type DatabaseStatus = 'loading' | 'ready' | 'error';

// The | symbol means "OR" - status can be 'loading' OR 'ready' OR 'error'
// This is called a "union type"

// ============================================
// GLOBAL VARIABLES WITH TYPES
// ============================================
// In TypeScript, we can specify what type each variable should be

// THE "any" TYPE EXPLAINED:
// "any" means "can be anything" - it's like opting out of type checking
// We use it here because the SQL.js library isn't written in TypeScript
// So TypeScript doesn't know what type db should be

let db: any = null;              // Database instance (any type because SQL.js)
let SQL: any = null;             // SQL.js library instance
let dbStatus: DatabaseStatus = 'loading';  // Can only be 'loading', 'ready', or 'error'

// Notice: dbStatus can't be set to "working" or "done" - only the three defined values
// TypeScript will show an error if you try to use a different value

// ============================================
// ASYNC FUNCTIONS WITH TYPES
// ============================================

// THE Promise<void> EXPLAINED:
// Promise - This function works asynchronously (doesn't finish immediately)
// <void> - This function doesn't return a value (void = nothing)
// Think of Promise<void> as: "This function will finish eventually, but won't give you anything back"

/**
 * Initialize SQL.js and create the database
 * Returns a Promise that resolves to nothing (void)
 */
async function initializeDatabase(): Promise<void> {
    // TRY-CATCH WITH TYPES:
    // The error in catch is typed as "any" because errors can be various types
    try {
        updateStatus('loading', 'Initializing database...');
        
        // AWAIT WITH TYPES:
        // initSqlJs returns a Promise<SQL>
        // await waits for the promise and gives us the SQL object
        // We declare SQL: any because the library doesn't have TypeScript types
        SQL = await initSqlJs({
            locateFile: (file: string): string => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        // ARROW FUNCTION WITH TYPES EXPLAINED:
        // (file: string): string =>
        // - file parameter must be a string
        // - : string after the parentheses means this function returns a string
        
        db = new SQL.Database();
        
        createTables();
        populateSampleData();
        
        updateStatus('ready', 'Database ready! Try running a query below.');
        dbStatus = 'ready';
        
    } catch (error: any) {
        // TYPE ASSERTION EXPLAINED:
        // : any after error tells TypeScript "trust me, error could be anything"
        // This is needed because errors can be various types (Error, string, etc.)
        
        console.error('Failed to initialize database:', error);
        
        // TYPE NARROWING EXPLAINED:
        // We check if error has a "message" property
        // This is called "type narrowing" - making the type more specific
        const message: string = error && error.message ? error.message : 'Unknown error';
        
        updateStatus('error', `Database initialization failed: ${message}`);
        dbStatus = 'error';
    }
}

/**
 * Create the students and courses tables
 * Returns nothing (void)
 */
function createTables(): void {
    // FUNCTION RETURN TYPE EXPLAINED:
    // : void means this function doesn't return anything
    // It does something (creates tables) but doesn't give anything back
    
    const createStudentsTable: string = `
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            grade INTEGER NOT NULL
        );
    `;
    
    // TYPE INFERENCE EXPLAINED:
    // TypeScript sees we assigned a string (the SQL text) to createStudentsTable
    // So it "infers" (figures out) that createStudentsTable is type string
    // We can also explicitly type it as: const createStudentsTable: string = ...
    
    const createCoursesTable: string = `
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            instructor TEXT NOT NULL,
            credits INTEGER NOT NULL
        );
    `;
    
    db.run(createStudentsTable);
    db.run(createCoursesTable);
}

/**
 * Populate tables with sample data
 */
function populateSampleData(): void {
    // ARRAY TYPES EXPLAINED:
    // Student[] means "array of Student objects"
    // Each object in the array must match the Student interface
    
    const students: Student[] = [
        { id: 1, name: 'Alice Johnson', age: 20, grade: 88 },
        { id: 2, name: 'Bob Smith', age: 19, grade: 92 },
        { id: 3, name: 'Carol Williams', age: 21, grade: 76 },
        { id: 4, name: 'David Brown', age: 20, grade: 85 },
        { id: 5, name: 'Eve Davis', age: 22, grade: 91 },
        { id: 6, name: 'Frank Miller', age: 19, grade: 73 },
        { id: 7, name: 'Grace Wilson', age: 21, grade: 89 },
        { id: 8, name: 'Henry Moore', age: 20, grade: 94 }
    ];
    
    // WHAT IF WE MAKE A MISTAKE?
    // Try uncommenting this line:
    // const badStudent: Student = { id: 9, name: 'Test', age: 'twenty', grade: 95 };
    // TypeScript will show an error: age must be a number, not a string!
    // This catches errors before running the code
    
    const courses: Course[] = [
        { id: 1, name: 'Introduction to Programming', instructor: 'Dr. Smith', credits: 4 },
        { id: 2, name: 'Data Structures', instructor: 'Prof. Johnson', credits: 3 },
        { id: 3, name: 'Web Development', instructor: 'Dr. Lee', credits: 3 },
        { id: 4, name: 'Database Systems', instructor: 'Prof. Garcia', credits: 4 },
        { id: 5, name: 'Computer Networks', instructor: 'Dr. Martinez', credits: 3 }
    ];
    
    const studentStmt = db.prepare('INSERT INTO students (id, name, age, grade) VALUES (?, ?, ?, ?)');
    const courseStmt = db.prepare('INSERT INTO courses (id, name, instructor, credits) VALUES (?, ?, ?, ?)');
    
    // FOREACH WITH TYPES:
    // student parameter automatically gets type Student
    // TypeScript infers this from the students array type
    students.forEach((student: Student) => {
        studentStmt.run([student.id, student.name, student.age, student.grade]);
        
        // TYPE SAFETY IN ACTION:
        // Try typing: student.
        // Your editor will show you: id, name, age, grade
        // It knows what properties Student has!
        
        // If you try: student.email
        // TypeScript error: Property 'email' does not exist on type 'Student'
    });
    
    courses.forEach((course: Course) => {
        courseStmt.run([course.id, course.name, course.instructor, course.credits]);
    });
    
    studentStmt.free();
    courseStmt.free();
}

/**
 * Update the database status display
 * @param status - The status to display (must be 'loading', 'ready', or 'error')
 * @param message - Status message to show
 */
function updateStatus(status: DatabaseStatus, message: string): void {
    // PARAMETER TYPES EXPLAINED:
    // status: DatabaseStatus - status must be one of our three defined values
    // message: string - message must be text
    // : void - function returns nothing
    
    // TYPE GUARD EXPLAINED:
    // This checks if statusDiv exists before using it
    // If statusDiv is null, we return early (guard clause)
    const statusDiv: HTMLElement | null = document.getElementById('db-status');
    if (!statusDiv) return;
    
    // UNION TYPE EXPLAINED:
    // HTMLElement | null means "either an HTMLElement OR null"
    // document.getElementById might not find the element, so it could be null
    
    // TERNARY OPERATOR WITH TYPES:
    // The result is always a string, regardless of which branch executes
    const statusClass: string = status === 'ready' ? 'ready' : status === 'error' ? 'error' : '';
    
    statusDiv.className = `db-status ${statusClass}`;
    statusDiv.innerHTML = `<span class="status-indicator"></span> ${message}`;
}

/**
 * Execute a SQL query and display results
 */
function executeQuery(): void {
    // EARLY RETURN WITH TYPE CHECKING:
    // We check dbStatus against our defined DatabaseStatus type
    if (dbStatus !== 'ready') {
        displayError('Database not ready. Please wait or refresh the page.');
        return;
    }
    
    // WORKING WITH DOM ELEMENTS:
    // HTMLTextAreaElement is the specific type for textarea elements
    const queryInput: HTMLTextAreaElement | null = document.getElementById('sql-query') as HTMLTextAreaElement;
    
    // TYPE ASSERTION EXPLAINED:
    // "as HTMLTextAreaElement" tells TypeScript: "trust me, this is a textarea"
    // We need this because getElementById returns HTMLElement | null
    // But we know it's specifically a textarea
    
    if (!queryInput) {
        displayError('Query input not found.');
        return;
    }
    
    const query: string = queryInput.value.trim();
    
    if (!query) {
        displayError('Please enter a SQL query.');
        return;
    }
    
    try {
        // RESULT TYPE:
        // exec returns an array, but we type it as any[] because the SQL.js types aren't perfect
        const results: any[] = db.exec(query);
        
        if (results.length === 0) {
            displaySuccess('Query executed successfully! (No data to display)');
        } else {
            // TYPE CASTING:
            // We tell TypeScript to treat results[0] as a QueryResult
            displayResults(results[0] as QueryResult);
        }
        
    } catch (error: any) {
        // ERROR HANDLING WITH TYPES:
        // We type error as any because caught errors can be various types
        const errorMessage: string = error && error.message ? error.message : 'Unknown error occurred';
        displayError(errorMessage);
    }
}

/**
 * Display query results as an HTML table
 * @param result - The query result containing columns and values
 */
function displayResults(result: QueryResult): void {
    // PARAMETER TYPE EXPLAINED:
    // result: QueryResult means result must have columns and values properties
    
    const resultsDiv: HTMLElement | null = document.getElementById('query-results');
    if (!resultsDiv) return;
    
    // DESTRUCTURING WITH TYPES:
    // TypeScript knows columns is string[] and values is any[][]
    // because that's defined in the QueryResult interface
    const { columns, values }: QueryResult = result;
    
    // ARRAY METHODS WITH TYPES:
    // map returns a new array
    // The type is inferred: string[] -> string[] (array of strings to array of strings)
    const headerRow: string = columns
        .map((col: string): string => `<th>${escapeHtml(col)}</th>`)
        .join('');
    
    // NESTED MAP WITH TYPES:
    // Outer map: any[][] -> string[] (array of rows to array of HTML strings)
    // Inner map: any[] -> string[] (array of cells to array of HTML strings)
    const bodyRows: string = values
        .map((row: any[]): string => {
            const cells: string = row
                .map((cell: any): string => `<td>${escapeHtml(String(cell))}</td>`)
                .join('');
            return `<tr>${cells}</tr>`;
        })
        .join('');
    
    // TEMPLATE LITERAL WITH TYPES:
    // The result is type string
    resultsDiv.innerHTML = `
        <h4>Query Results (${values.length} row${values.length === 1 ? '' : 's'})</h4>
        <table>
            <thead>
                <tr>${headerRow}</tr>
            </thead>
            <tbody>
                ${bodyRows}
            </tbody>
        </table>
    `;
}

/**
 * Display a success message
 * @param message - Success message to display
 */
function displaySuccess(message: string): void {
    const resultsDiv: HTMLElement | null = document.getElementById('query-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <h4>Success!</h4>
        <p class="success">${escapeHtml(message)}</p>
    `;
}

/**
 * Display an error message
 * @param message - Error message to display
 */
function displayError(message: string): void {
    const resultsDiv: HTMLElement | null = document.getElementById('query-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <h4>Error</h4>
        <p class="error">${escapeHtml(message)}</p>
    `;
}

/**
 * Escape HTML to prevent XSS attacks
 * @param text - Text to escape
 * @returns Escaped HTML-safe text
 */
function escapeHtml(text: string): string {
    // FUNCTION SIGNATURE EXPLAINED:
    // (text: string): string
    // Input: must be a string
    // Output: returns a string
    // TypeScript enforces both!
    
    const div: HTMLDivElement = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
    
    // RETURN TYPE CHECKING:
    // If we accidentally returned a number instead of string,
    // TypeScript would show an error
}

/**
 * Set the query textarea to a predefined query
 * @param query - The query to set
 */
function setQuery(query: string): void {
    const queryInput: HTMLTextAreaElement | null = document.getElementById('sql-query') as HTMLTextAreaElement;
    if (queryInput) {
        queryInput.value = query;
    }
}

/**
 * Clear the query textarea
 */
function clearQuery(): void {
    const queryInput: HTMLTextAreaElement | null = document.getElementById('sql-query') as HTMLTextAreaElement;
    if (queryInput) {
        queryInput.value = '';
    }
}

/**
 * Reset the database to its original state
 */
function resetDatabase(): void {
    if (dbStatus !== 'ready') {
        alert('Database not ready. Please wait or refresh the page.');
        return;
    }
    
    // BOOLEAN TYPE EXPLAINED:
    // confirm() returns true or false (boolean type)
    const confirmed: boolean = confirm('Are you sure you want to reset the database? All changes will be lost.');
    
    if (!confirmed) {
        return;
    }
    
    try {
        db.run('DROP TABLE IF EXISTS students');
        db.run('DROP TABLE IF EXISTS courses');
        
        createTables();
        populateSampleData();
        
        alert('Database reset successfully!');
        
        const resultsDiv: HTMLElement | null = document.getElementById('query-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = '<h4>Database reset! Ready for new queries.</h4>';
        }
        
    } catch (error: any) {
        const errorMessage: string = error && error.message ? error.message : 'Unknown error';
        alert(`Failed to reset database: ${errorMessage}`);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', (): void => {
    // ARROW FUNCTION AS CALLBACK:
    // (): void => means this function takes no parameters and returns nothing
    
    console.log('Page loaded. Initializing database...');
    initializeDatabase();
    
    const queryInput: HTMLTextAreaElement | null = document.getElementById('sql-query') as HTMLTextAreaElement;
    
    if (queryInput) {
        // EVENT LISTENER WITH TYPES:
        // event parameter is typed as KeyboardEvent
        queryInput.addEventListener('keydown', (event: KeyboardEvent): void => {
            // KeyboardEvent has properties like: key, ctrlKey, metaKey, etc.
            // TypeScript knows these exist and helps you use them correctly
            
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                executeQuery();
            }
        });
    }
});

// ============================================
// WINDOW OBJECT AUGMENTATION
// ============================================

// EXTENDING WINDOW INTERFACE:
// This tells TypeScript that we're adding properties to the window object
// Without this, TypeScript would show errors when we assign to window.executeQuery

declare global {
    interface Window {
        executeQuery: () => void;
        setQuery: (query: string) => void;
        clearQuery: () => void;
        resetDatabase: () => void;
    }
}

// Now we can safely assign our functions to window
window.executeQuery = executeQuery;
window.setQuery = setQuery;
window.clearQuery = clearQuery;
window.resetDatabase = resetDatabase;

// ============================================
// TYPESCRIPT CONCEPTS SUMMARY
// ============================================
//
// KEY CONCEPTS DEMONSTRATED:
//
// 1. TYPES:
//    - Primitive types: string, number, boolean
//    - Array types: string[], number[], Student[]
//    - Union types: string | number, HTMLElement | null
//    - Any type: when we can't or don't want to specify exact type
//
// 2. INTERFACES:
//    - Define the shape of objects
//    - Student, Course, QueryResult interfaces
//    - Reusable blueprints for data structures
//
// 3. TYPE ALIASES:
//    - DatabaseStatus type
//    - Create named types for specific use cases
//
// 4. FUNCTION TYPES:
//    - Parameter types: (text: string)
//    - Return types: : string, : void, : Promise<void>
//    - Arrow function types: (x: number): number => x * 2
//
// 5. TYPE ASSERTIONS:
//    - "as HTMLTextAreaElement" tells TypeScript about specific types
//    - Use when you know more than TypeScript does
//
// 6. TYPE GUARDS:
//    - if (variable) checks if variable exists
//    - Narrows type from "Type | null" to just "Type"
//
// 7. GENERICS (advanced, not shown here):
//    - Promise<void>, Array<Student>
//    - Types that work with other types
//
// WHY TYPESCRIPT?
// - Catches errors at compile time (before running)
// - Better editor support (autocomplete, refactoring)
// - Self-documenting code (types show intent)
// - Easier to maintain large projects
// - Helps teams work together
//
// TYPESCRIPT vs JAVASCRIPT:
// - JavaScript: let x = 5;
// - TypeScript: let x: number = 5;
//
// - JavaScript: function add(a, b) { return a + b; }
// - TypeScript: function add(a: number, b: number): number { return a + b; }
//
// TypeScript is JavaScript with extra information about types!
//
// ============================================
