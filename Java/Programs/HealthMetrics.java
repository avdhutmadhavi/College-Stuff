public class HealthMetrics {
    public static void main(String[] args) {
        int pulse = 80;
        int temperature = 98;
        double weight = 70.0;
        double height = 1.75;

        double bmi = weight / (height * height);
        int pulsePlus = pulse + 5;
        boolean normalPulse = pulse >= 60 && pulse <= 100;

        int flags = 40;
        int shifted = flags >>> 2;

        double integerToDouble = pulse;
        int doubleToInteger = (int) weight;

        System.out.println("BMI = " + bmi);
        System.out.println("Pulse + 5 = " + pulsePlus);
        System.out.println("Pulse in normal range = " + normalPulse);
        System.out.println("40 >>> 2 = " + shifted);
        System.out.println("Widening conversion = " + integerToDouble);
        System.out.println("Narrowing conversion = " + doubleToInteger);
    }
}