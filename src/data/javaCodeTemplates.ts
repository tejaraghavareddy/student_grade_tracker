export const JAVA_ARRAYLIST_CODE = `import java.util.ArrayList;
import java.util.Scanner;

/**
 * Student Grade Tracker
 * Uses ArrayList to dynamically store and manage student data.
 */
public class StudentGradeManager {

    // Student model class
    static class Student {
        private String id;
        private String name;
        private double score;

        public Student(String id, String name, double score) {
            this.id = id;
            this.name = name;
            this.score = score;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public double getScore() { return score; }

        public String getLetterGrade() {
            if (score >= 90) return "A";
            if (score >= 80) return "B";
            if (score >= 70) return "C";
            if (score >= 60) return "D";
            return "F";
        }

        public String getStatus() {
            return score >= 60 ? "Passed" : "Failed";
        }
    }

    private static ArrayList<Student> studentList = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        // Seed initial data
        seedData();

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("Enter your choice (1-6): ");
            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1":
                    addStudent();
                    break;
                case "2":
                    displaySummaryReport();
                    break;
                case "3":
                    searchStudentById();
                    break;
                case "4":
                    calculateAndDisplayStats();
                    break;
                case "5":
                    removeStudent();
                    break;
                case "6":
                    System.out.println("\\nThank you for using Student Grade Manager. Goodbye!");
                    running = false;
                    break;
                default:
                    System.out.println("Invalid option! Please enter a number between 1 and 6.");
            }
        }
        scanner.close();
    }

    private static void seedData() {
        // System starts with no pre-loaded student records
    }

    private static void printMenu() {
        System.out.println("\\n==================================================");
        System.out.println("       STUDENT GRADE MANAGEMENT SYSTEM (ArrayList) ");
        System.out.println("==================================================");
        System.out.println(" 1. Add New Student");
        System.out.println(" 2. Display Summary Report");
        System.out.println(" 3. Search Student by ID");
        System.out.println(" 4. Calculate Statistics (Avg, Max, Min)");
        System.out.println(" 5. Remove Student by ID");
        System.out.println(" 6. Exit");
        System.out.println("==================================================");
    }

    private static void addStudent() {
        System.out.println("\\n--- Add New Student ---");
        System.out.print("Enter Student ID: ");
        String id = scanner.nextLine().trim();

        // Check if ID already exists
        if (findStudentById(id) != null) {
            System.out.println("Error: Student ID '" + id + "' already exists!");
            return;
        }

        System.out.print("Enter Student Name: ");
        String name = scanner.nextLine().trim();

        double score = -1;
        while (score < 0 || score > 100) {
            System.out.print("Enter Overall Grade/Score (0-100): ");
            try {
                score = Double.parseDouble(scanner.nextLine().trim());
                if (score < 0 || score > 100) {
                    System.out.println("Invalid score! Please enter a value between 0 and 100.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format! Please try again.");
            }
        }

        studentList.add(new Student(id, name, score));
        System.out.println("Successfully added student: " + name + " (ID: " + id + ")");
    }

    private static void displaySummaryReport() {
        if (studentList.isEmpty()) {
            System.out.println("\\nNo students currently enrolled.");
            return;
        }

        System.out.println("\\n===========================================================================");
        System.out.println("                             STUDENT SUMMARY REPORT                        ");
        System.out.println("===========================================================================");
        System.out.printf("%-10s %-25s %-10s %-8s %-8s\\n", "ID", "Name", "Score", "Grade", "Status");
        System.out.println("---------------------------------------------------------------------------");

        for (Student s : studentList) {
            System.out.printf("%-10s %-25s %-10.2f %-8s %-8s\\n",
                    s.getId(), s.getName(), s.getScore(), s.getLetterGrade(), s.getStatus());
        }
        System.out.println("---------------------------------------------------------------------------");
        System.out.println("Total Enrolled Students: " + studentList.size());
    }

    private static void searchStudentById() {
        System.out.println("\\n--- Search Student by ID ---");
        System.out.print("Enter Student ID to search: ");
        String searchId = scanner.nextLine().trim();

        Student student = findStudentById(searchId);
        if (student != null) {
            System.out.println("\\n[RECORD FOUND]");
            System.out.println("ID:          " + student.getId());
            System.out.println("Name:        " + student.getName());
            System.out.println("Score:       " + String.format("%.2f", student.getScore()));
            System.out.println("Grade:       " + student.getLetterGrade());
            System.out.println("Status:      " + student.getStatus());
        } else {
            System.out.println("\\nStudent with ID '" + searchId + "' was NOT found.");
        }
    }

    private static Student findStudentById(String id) {
        for (Student s : studentList) {
            if (s.getId().equalsIgnoreCase(id)) {
                return s;
            }
        }
        return null;
    }

    private static void calculateAndDisplayStats() {
        if (studentList.isEmpty()) {
            System.out.println("\\nNo student data available to calculate statistics.");
            return;
        }

        double sum = 0;
        double highest = studentList.get(0).getScore();
        double lowest = studentList.get(0).getScore();

        Student highestStudent = studentList.get(0);
        Student lowestStudent = studentList.get(0);

        for (Student s : studentList) {
            double score = s.getScore();
            sum += score;

            if (score > highest) {
                highest = score;
                highestStudent = s;
            }

            if (score < lowest) {
                lowest = score;
                lowestStudent = s;
            }
        }

        double average = sum / studentList.size();

        System.out.println("\\n==================================================");
        System.out.println("               CLASS PERFORMANCE STATS            ");
        System.out.println("==================================================");
        System.out.printf("Total Students:   %d\\n", studentList.size());
        System.out.printf("Average Score:    %.2f\\n", average);
        System.out.printf("Highest Score:    %.2f (%s - ID: %s)\\n",
                highest, highestStudent.getName(), highestStudent.getId());
        System.out.printf("Lowest Score:     %.2f (%s - ID: %s)\\n",
                lowest, lowestStudent.getName(), lowestStudent.getId());
        System.out.println("==================================================");
    }

    private static void removeStudent() {
        System.out.println("\\n--- Remove Student ---");
        System.out.print("Enter Student ID to remove: ");
        String id = scanner.nextLine().trim();

        Student student = findStudentById(id);
        if (student != null) {
            studentList.remove(student);
            System.out.println("Successfully removed student '" + student.getName() + "' (ID: " + id + ").");
        } else {
            System.out.println("Error: Student ID '" + id + "' not found.");
        }
    }
}
`;

export const JAVA_ARRAY_CODE = `import java.util.Scanner;

/**
 * Student Grade Tracker
 * Uses Fixed-Size Array (Student[]) with element tracking.
 */
public class StudentGradeManagerArray {

    static class Student {
        private String id;
        private String name;
        private double score;

        public Student(String id, String name, double score) {
            this.id = id;
            this.name = name;
            this.score = score;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public double getScore() { return score; }

        public String getLetterGrade() {
            if (score >= 90) return "A";
            if (score >= 80) return "B";
            if (score >= 70) return "C";
            if (score >= 60) return "D";
            return "F";
        }

        public String getStatus() {
            return score >= 60 ? "Passed" : "Failed";
        }
    }

    private static final int MAX_CAPACITY = 100;
    private static Student[] students = new Student[MAX_CAPACITY];
    private static int count = 0; // Tracks actual number of students stored
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        seedInitialData();

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("Select an option (1-5): ");
            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1":
                    addStudent();
                    break;
                case "2":
                    displaySummary();
                    break;
                case "3":
                    searchStudent();
                    break;
                case "4":
                    calculateStats();
                    break;
                case "5":
                    System.out.println("Exiting program.");
                    running = false;
                    break;
                default:
                    System.out.println("Invalid selection!");
            }
        }
    }

    private static void seedInitialData() {
        // System starts with no pre-loaded student records
        count = 0;
    }

    private static void printMenu() {
        System.out.println("\\n--- STUDENT GRADE MANAGER (Fixed Array[]) ---");
        System.out.println("1. Add Student");
        System.out.println("2. Display Summary");
        System.out.println("3. Search Student by ID");
        System.out.println("4. Calculate Stats");
        System.out.println("5. Exit");
    }

    private static void addStudent() {
        if (count >= MAX_CAPACITY) {
            System.out.println("Error: Class list is full! Maximum capacity of " + MAX_CAPACITY + " reached.");
            return;
        }

        System.out.print("Enter ID: ");
        String id = scanner.nextLine().trim();

        System.out.print("Enter Name: ");
        String name = scanner.nextLine().trim();

        System.out.print("Enter Score (0-100): ");
        double score = Double.parseDouble(scanner.nextLine().trim());

        students[count] = new Student(id, name, score);
        count++;
        System.out.println("Student added successfully into array index [" + (count - 1) + "]");
    }

    private static void displaySummary() {
        System.out.printf("%-10s %-20s %-10s %-8s\\n", "ID", "Name", "Score", "Grade");
        for (int i = 0; i < count; i++) {
            Student s = students[i];
            System.out.printf("%-10s %-20s %-10.2f %-8s\\n", s.getId(), s.getName(), s.getScore(), s.getLetterGrade());
        }
    }

    private static void searchStudent() {
        System.out.print("Enter Student ID: ");
        String id = scanner.nextLine().trim();

        for (int i = 0; i < count; i++) {
            if (students[i].getId().equalsIgnoreCase(id)) {
                Student s = students[i];
                System.out.println("Found at Array Index [" + i + "]: " + s.getName() + " - Score: " + s.getScore());
                return;
            }
        }
        System.out.println("Student ID not found in array.");
    }

    private static void calculateStats() {
        if (count == 0) return;

        double sum = 0;
        double max = students[0].getScore();
        double min = students[0].getScore();

        for (int i = 0; i < count; i++) {
            double val = students[i].getScore();
            sum += val;
            if (val > max) max = val;
            if (val < min) min = val;
        }

        System.out.printf("Average: %.2f | Highest: %.2f | Lowest: %.2f\\n", (sum / count), max, min);
    }
}
`;
