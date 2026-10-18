class Doctor {
    int id;
    String name;
    String specialization;

    void display() {
        System.out.println("Doctor ID : " + id);
        System.out.println("Name      : " + name);
        System.out.println("Specialization : " + specialization);
        System.out.println();
    }
}

public class DoctorObjectDemo {
    public static void main(String[] args) {
        Doctor d1 = new Doctor();
        d1.id = 201;
        d1.name = "Rahul";
        d1.specialization = "Cardiology";

        Doctor d2 = new Doctor();
        d2.id = 202;
        d2.name = "Priya";
        d2.specialization = "Neurology";

        d1.display();
        d2.display();
    }
}