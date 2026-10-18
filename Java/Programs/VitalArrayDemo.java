public class VitalArrayDemo {
    public static void main(String[] args) {
        int[] pulse = {65, 70, 75, 80, 85};
        int total = 0;

        System.out.println("Pulse readings:");

        for (int i = 0; i < pulse.length; i++) {
            System.out.println("Reading " + (i + 1) + ": " + pulse[i]);
            total += pulse[i];
        }

        double average = (double) total / pulse.length;
        System.out.println("Sum = " + total);
        System.out.println("Average = " + average);

        System.out.println("Using enhanced for loop:");
        for (int value : pulse) {
            System.out.print(value + " ");
        }
        System.out.println();

        int i = 0;
        while (i < pulse.length) {
            if (pulse[i] > 75) {
                System.out.println("Reading above 75: " + pulse[i]);
            }
            i++;
        }

        int[][] ward = {
            {101, 102},
            {201, 202}
        };

        System.out.println("Ward matrix:");
        for (int r = 0; r < ward.length; r++) {
            for (int c = 0; c < ward[r].length; c++) {
                System.out.print(ward[r][c] + " ");
            }
            System.out.println();
        }
    }
}