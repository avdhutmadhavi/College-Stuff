import java.util.Scanner;

public class HealthServiceMenu {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter service code (1-3): ");
        int code = sc.nextInt();

        if (code >= 1 && code <= 3) {
            System.out.println("Valid service code.");
        } else {
            System.out.println("Invalid service code.");
        }

        switch (code) {
            case 1:
                System.out.println("General Consultation");
                break;

            case 2:
                System.out.println("Laboratory Test");
                break;

            case 3:
                System.out.println("Pharmacy Service");
                break;

            default:
                System.out.println("No service selected.");
        }

        sc.close();
    }
}