class PatientRecord {
    private int id;
    private String name;
    private int age;
    private static int count = 0;

    // Parameterized constructor
    PatientRecord(int id, String name, int age) {
        this.id = id;
        this.name = name;
        this.age = age;
        count++;
    }

    // Getter methods
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    // Setter method
    public void setAge(int age) {
        if (age > 0) {
            this.age = age;
        }
    }

    // Static method
    public static int getCount() {
        return count;
    }

    public void display() {
        System.out.println(id + " " + name + " " + age);
    }
}

public class EncapsulationDemo {
    public static void main(String[] args) {
        PatientRecord p1 =
            new PatientRecord(101, "Aarav", 21);

        PatientRecord p2 =
            new PatientRecord(102, "Meera", 22);

        System.out.println("Before modification:");
        p1.display();
        p2.display();

        // Modify age using setter
        p1.setAge(23);

        System.out.println("After modification:");
        p1.display();

        System.out.println("Patient objects: "
                           + PatientRecord.getCount());
    }
}