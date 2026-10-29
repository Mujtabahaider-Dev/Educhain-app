import { Stage, Question } from "@/types/curriculum";

export const STAGES_DATA: Stage[] = [
  {
    "id": 1,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 1,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Matrices and Determinants",
    "topic": "Introduction to Matrices, Orders & Matrix Types",
    "learningObjective": "Identify rows, columns, order of a matrix, and distinguish square, rectangular, and identity matrices.",
    "title": "Matrix Foundations & Orders",
    "description": "Explore the building blocks of linear algebra: matrix dimensions, row/column vectors, and the identity matrix.",
    "difficulty": "Easy",
    "xpReward": 100,
    "questions": [
      {
        "id": "q_m1_1",
        "question": "What is the order of a matrix having 2 rows and 3 columns?",
        "options": [
          "3-by-2",
          "2-by-3",
          "2-by-2",
          "3-by-3"
        ],
        "correctIndex": 1,
        "explanation": "The order of a matrix is written as rows-by-columns (m-by-n). Since there are 2 rows and 3 columns, the order is 2-by-3.",
        "tags": [
          "matrices",
          "matrix-order"
        ]
      },
      {
        "id": "q_m1_2",
        "question": "Which of the following describes an Identity Matrix of order 2-by-2?",
        "options": [
          "[[0, 1], [1, 0]]",
          "[[1, 0], [0, 1]]",
          "[[1, 1], [1, 1]]",
          "[[0, 0], [0, 0]]"
        ],
        "correctIndex": 1,
        "explanation": "A multiplicative identity matrix (I) has main diagonal entries equal to 1 and all other non-diagonal entries equal to 0: [[1, 0], [0, 1]].",
        "tags": [
          "matrices",
          "identity-matrix"
        ]
      },
      {
        "id": "q_m1_3",
        "question": "If matrix A = [[2, 4], [1, 3]], what is the determinant |A|?",
        "options": [
          "2",
          "10",
          "6",
          "-2"
        ],
        "correctIndex": 0,
        "explanation": "For a 2x2 matrix [[a, b], [c, d]], det(A) = ad - bc. Here: (2 * 3) - (4 * 1) = 6 - 4 = 2.",
        "tags": [
          "matrices",
          "determinant"
        ]
      },
      {
        "id": "q_m1_4",
        "question": "What is a matrix called if its determinant is equal to zero?",
        "options": [
          "Singular Matrix",
          "Non-singular Matrix",
          "Identity Matrix",
          "Scalar Matrix"
        ],
        "correctIndex": 0,
        "explanation": "A square matrix A is defined as singular if det(A) = 0. Singular matrices do not possess a multiplicative inverse.",
        "tags": [
          "matrices",
          "singular-matrix"
        ]
      },
      {
        "id": "q_m1_5",
        "question": "What is the transpose of row matrix [5, 8, 12]?",
        "options": [
          "Row matrix [12, 8, 5]",
          "Column matrix [[5], [8], [12]]",
          "Square matrix [[5, 8], [12, 0]]",
          "Zero matrix [0, 0, 0]"
        ],
        "correctIndex": 1,
        "explanation": "The transpose operation interchanges rows into columns. A 1-by-3 row vector becomes a 3-by-1 column vector.",
        "tags": [
          "matrices",
          "transpose"
        ]
      }
    ]
  },
  {
    "id": 2,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 2,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 2,
    "levelName": "Intermediate",
    "chapter": "Real and Complex Numbers",
    "topic": "Rational vs. Irrational Numbers & Imaginary Unit i",
    "learningObjective": "Classify real numbers, simplify radicals, and compute powers of the imaginary unit i.",
    "title": "Real & Complex Number Systems",
    "description": "Deepen understanding of rational, irrational, and imaginary numbers including basic properties of i.",
    "difficulty": "Easy",
    "xpReward": 120,
    "questions": [
      {
        "id": "q_m2_1",
        "question": "Which of the following numbers is an irrational number?",
        "options": [
          "3/4",
          "0.25",
          "√7",
          "√9"
        ],
        "correctIndex": 2,
        "explanation": "√7 cannot be expressed as a quotient of two integers (p/q, q ≠ 0) and has a non-repeating, non-terminating decimal representation. √9 = 3 (rational).",
        "tags": [
          "real-numbers",
          "irrational"
        ]
      },
      {
        "id": "q_m2_2",
        "question": "What is the fundamental value of i² in complex numbers?",
        "options": [
          "1",
          "-1",
          "0",
          "√-1"
        ],
        "correctIndex": 1,
        "explanation": "The imaginary unit i is defined as √(-1), meaning that squaring both sides gives i² = -1.",
        "tags": [
          "complex-numbers",
          "imaginary-unit"
        ]
      },
      {
        "id": "q_m2_3",
        "question": "What is the conjugate of the complex number (5 - 3i)?",
        "options": [
          "5 + 3i",
          "-5 - 3i",
          "-5 + 3i",
          "3 - 5i"
        ],
        "correctIndex": 0,
        "explanation": "The complex conjugate of (a + bi) is obtained by reversing the sign of the imaginary part: (a - bi). Thus conjugate of 5 - 3i is 5 + 3i.",
        "tags": [
          "complex-numbers",
          "conjugate"
        ]
      },
      {
        "id": "q_m2_4",
        "question": "What is the value of i⁹?",
        "options": [
          "1",
          "-1",
          "i",
          "-i"
        ],
        "correctIndex": 2,
        "explanation": "i⁹ = (i⁴)² * i¹ = (1)² * i = i.",
        "tags": [
          "complex-numbers",
          "powers-of-i"
        ]
      },
      {
        "id": "q_m2_5",
        "question": "Which property of real numbers is shown by: a * (b + c) = a*b + a*c?",
        "options": [
          "Commutative Property",
          "Associative Property",
          "Distributive Property",
          "Closure Property"
        ],
        "correctIndex": 2,
        "explanation": "Distributive property of multiplication over addition asserts that multiplying a sum by a number gives the same result as multiplying each addend.",
        "tags": [
          "real-numbers",
          "properties"
        ]
      }
    ]
  },
  {
    "id": 3,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 3,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 3,
    "levelName": "Applied",
    "chapter": "Logarithms",
    "topic": "Laws of Logarithms & Exponential Conversions",
    "learningObjective": "Convert between logarithmic and exponential forms and apply product, quotient, and power rules of logs.",
    "title": "Logarithmic Laws & Calculations",
    "description": "Master the laws of logarithms used in scientific calculations, pH scales, and exponential decay models.",
    "difficulty": "Medium",
    "xpReward": 140,
    "questions": [
      {
        "id": "q_m3_1",
        "question": "If 2⁵ = 32, what is this written in logarithmic form?",
        "options": [
          "log₂ 32 = 5",
          "log₅ 32 = 2",
          "log₃₂ 2 = 5",
          "log₂ 5 = 32"
        ],
        "correctIndex": 0,
        "explanation": "If b^y = x, the logarithmic statement is log_b(x) = y. Here base is 2, argument is 32, and exponent is 5: log₂ 32 = 5.",
        "tags": [
          "logarithms",
          "exponential-form"
        ]
      },
      {
        "id": "q_m3_2",
        "question": "According to the product law of logarithms, log_a(m * n) equals:",
        "options": [
          "log_a(m) * log_a(n)",
          "log_a(m) + log_a(n)",
          "log_a(m) - log_a(n)",
          "log_a(m) / log_a(n)"
        ],
        "correctIndex": 1,
        "explanation": "The product law of logarithms states that the log of a product is equal to the sum of the logs: log_a(m * n) = log_a(m) + log_a(n).",
        "tags": [
          "logarithms",
          "laws-of-logs"
        ]
      },
      {
        "id": "q_m3_3",
        "question": "What is the value of log₁₀(1000)?",
        "options": [
          "1",
          "2",
          "3",
          "10"
        ],
        "correctIndex": 2,
        "explanation": "Since 10³ = 1000, the common logarithm log₁₀(1000) = 3.",
        "tags": [
          "logarithms",
          "common-log"
        ]
      },
      {
        "id": "q_m3_4",
        "question": "What is the value of log_a(1) for any positive base a ≠ 1?",
        "options": [
          "0",
          "1",
          "a",
          "Undefined"
        ],
        "correctIndex": 0,
        "explanation": "Since a⁰ = 1 for any non-zero real number a, log_a(1) is always 0.",
        "tags": [
          "logarithms",
          "properties"
        ]
      },
      {
        "id": "q_m3_5",
        "question": "Simplify: log_a(m³) using the power law of logarithms.",
        "options": [
          "m * log_a(3)",
          "3 + log_a(m)",
          "3 * log_a(m)",
          "(log_a(m))³"
        ],
        "correctIndex": 2,
        "explanation": "The power law states log_a(m^n) = n * log_a(m). Bringing exponent 3 to the front yields 3 * log_a(m).",
        "tags": [
          "logarithms",
          "power-law"
        ]
      }
    ]
  },
  {
    "id": 4,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 4,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 3,
    "levelName": "Applied",
    "chapter": "Algebraic Expressions & Formulas",
    "topic": "Standard Algebraic Identities & Factoring",
    "learningObjective": "Expand and factor expressions using (a+b)², (a-b)², and difference of two squares (a² - b²).",
    "title": "Algebraic Identities & Factoring",
    "description": "Harness essential polynomial identities to solve expressions, simplify rational polynomials, and factor equations.",
    "difficulty": "Medium",
    "xpReward": 160,
    "questions": [
      {
        "id": "q_m4_1",
        "question": "What is the expanded form of (2x + 3y)²?",
        "options": [
          "4x² + 9y²",
          "4x² + 12xy + 9y²",
          "2x² + 6xy + 3y²",
          "4x² + 6xy + 9y²"
        ],
        "correctIndex": 1,
        "explanation": "Using (a + b)² = a² + 2ab + b²: (2x)² + 2(2x)(3y) + (3y)² = 4x² + 12xy + 9y².",
        "tags": [
          "algebra",
          "identities"
        ]
      },
      {
        "id": "q_m4_2",
        "question": "Factor completely: x² - 49.",
        "options": [
          "(x - 7)²",
          "(x + 7)(x - 7)",
          "(x + 49)(x - 1)",
          "(x - 7)(x - 7)"
        ],
        "correctIndex": 1,
        "explanation": "Difference of two squares identity a² - b² = (a + b)(a - b). Here x² - 7² = (x + 7)(x - 7).",
        "tags": [
          "algebra",
          "factoring"
        ]
      },
      {
        "id": "q_m4_3",
        "question": "If x + 1/x = 4, what is the value of x² + 1/x²?",
        "options": [
          "14",
          "16",
          "18",
          "12"
        ],
        "correctIndex": 0,
        "explanation": "Square both sides: (x + 1/x)² = 4² => x² + 2 + 1/x² = 16 => x² + 1/x² = 16 - 2 = 14.",
        "tags": [
          "algebra",
          "identities"
        ]
      },
      {
        "id": "q_m4_4",
        "question": "What are the factors of x² + 5x + 6?",
        "options": [
          "(x + 2)(x + 3)",
          "(x + 1)(x + 6)",
          "(x - 2)(x - 3)",
          "(x + 5)(x + 1)"
        ],
        "correctIndex": 0,
        "explanation": "We look for two numbers that multiply to 6 and add to 5: 2 and 3. Thus (x + 2)(x + 3).",
        "tags": [
          "algebra",
          "quadratic-factoring"
        ]
      },
      {
        "id": "q_m4_5",
        "question": "Which of the following expressions is NOT a polynomial?",
        "options": [
          "3x² + 5x - 7",
          "2x + 9",
          "5x³ + 4/√x - 2",
          "x⁴ - 1"
        ],
        "correctIndex": 2,
        "explanation": "In a polynomial, the exponent of every variable must be a non-negative integer (whole number). 4/√x = 4x^(-1/2), which has a fractional negative power.",
        "tags": [
          "algebra",
          "polynomials"
        ]
      }
    ]
  },
  {
    "id": 5,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 5,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 4,
    "levelName": "Advanced",
    "chapter": "Linear Equations and Inequalities",
    "topic": "Single Variable Equations, Absolute Values & Inequalities",
    "learningObjective": "Solve single variable linear equations, identify extraneous roots, and manipulate linear inequalities.",
    "title": "Linear Equations & Inequalities",
    "description": "Solve linear equations, understand absolute value mechanics, and graph inequality boundaries on a number line.",
    "difficulty": "Hard",
    "xpReward": 180,
    "questions": [
      {
        "id": "q_m5_1",
        "question": "Solve for x: 3x - 7 = 2x + 5.",
        "options": [
          "x = 2",
          "x = 12",
          "x = -12",
          "x = 8"
        ],
        "correctIndex": 1,
        "explanation": "Subtract 2x from both sides: x - 7 = 5. Add 7 to both sides: x = 12.",
        "tags": [
          "equations",
          "linear-equations"
        ]
      },
      {
        "id": "q_m5_2",
        "question": "What is the solution set of |x - 3| = 5?",
        "options": [
          "{8}",
          "{-2, 8}",
          "{2, 8}",
          "{8, -8}"
        ],
        "correctIndex": 1,
        "explanation": "By definition of absolute value, x - 3 = 5 or x - 3 = -5. Thus x = 8 or x = -2.",
        "tags": [
          "equations",
          "absolute-value"
        ]
      },
      {
        "id": "q_m5_3",
        "question": "Solve the inequality: -2x < 8. What is the correct solution?",
        "options": [
          "x < -4",
          "x > -4",
          "x < 4",
          "x > 4"
        ],
        "correctIndex": 1,
        "explanation": "When multiplying or dividing both sides of an inequality by a negative number (-2), the direction of the inequality sign reverses: x > -4.",
        "tags": [
          "inequalities",
          "rule-reversal"
        ]
      },
      {
        "id": "q_m5_4",
        "question": "If 2(x - 3) = 14, what is the value of x + 5?",
        "options": [
          "10",
          "15",
          "12",
          "17"
        ],
        "correctIndex": 1,
        "explanation": "Divide by 2: x - 3 = 7 => x = 10. Then x + 5 = 10 + 5 = 15.",
        "tags": [
          "equations",
          "multi-step"
        ]
      },
      {
        "id": "q_m5_5",
        "question": "An equation containing the variable under a radical sign is termed a:",
        "options": [
          "Linear equation",
          "Quadratic equation",
          "Radical equation",
          "Identity"
        ],
        "correctIndex": 2,
        "explanation": "An equation where the variable appears underneath a radical (square root, cube root, etc.) is called a radical equation.",
        "tags": [
          "equations",
          "definitions"
        ]
      }
    ]
  },
  {
    "id": 6,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 6,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 5,
    "levelName": "Mastery",
    "chapter": "Introduction to Coordinate Geometry",
    "topic": "Cartesian Plane, Distance Formula & Midpoint Formula",
    "learningObjective": "Calculate the distance between points, locate midpoints, and determine quadrant positions in Cartesian space.",
    "title": "Coordinate Geometry & Plane Analytics",
    "description": "Connect geometric figures with algebraic formulas using Cartesian coordinates, distance metrics, and midpoints.",
    "difficulty": "Hard",
    "xpReward": 200,
    "questions": [
      {
        "id": "q_m6_1",
        "question": "In which quadrant of the Cartesian plane does the point (-4, 7) lie?",
        "options": [
          "Quadrant I",
          "Quadrant II",
          "Quadrant III",
          "Quadrant IV"
        ],
        "correctIndex": 1,
        "explanation": "In Quadrant II, the x-coordinate is negative (x < 0) and the y-coordinate is positive (y > 0).",
        "tags": [
          "coordinate-geometry",
          "quadrants"
        ]
      },
      {
        "id": "q_m6_2",
        "question": "What is the distance between points P(0, 0) and Q(6, 8)?",
        "options": [
          "10",
          "14",
          "48",
          "12"
        ],
        "correctIndex": 0,
        "explanation": "Using the distance formula d = √((x₂-x₁)² + (y₂-y₁)²): √((6-0)² + (8-0)²) = √(36 + 64) = √100 = 10.",
        "tags": [
          "coordinate-geometry",
          "distance-formula"
        ]
      },
      {
        "id": "q_m6_3",
        "question": "What are the coordinates of the midpoint of segment joining A(2, 4) and B(6, 10)?",
        "options": [
          "(4, 7)",
          "(8, 14)",
          "(3, 5)",
          "(4, 6)"
        ],
        "correctIndex": 0,
        "explanation": "Midpoint M = ((x₁+x₂)/2, (y₁+y₂)/2) = ((2+6)/2, (4+10)/2) = (8/2, 14/2) = (4, 7).",
        "tags": [
          "coordinate-geometry",
          "midpoint-formula"
        ]
      },
      {
        "id": "q_m6_4",
        "question": "Points that lie on the exact same straight line are called:",
        "options": [
          "Equidistant",
          "Collinear",
          "Coplanar",
          "Concurrent"
        ],
        "correctIndex": 1,
        "explanation": "Points are defined as collinear if there is a single straight line passing through all of them.",
        "tags": [
          "coordinate-geometry",
          "collinear-points"
        ]
      },
      {
        "id": "q_m6_5",
        "question": "What is the slope (gradient) of a horizontal line parallel to the x-axis?",
        "options": [
          "0",
          "1",
          "Undefined",
          "-1"
        ],
        "correctIndex": 0,
        "explanation": "A horizontal line has zero vertical change (rise = 0), so its slope m = rise / run = 0.",
        "tags": [
          "coordinate-geometry",
          "slope"
        ]
      }
    ]
  },
  {
    "id": 7,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 1,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Physical Quantities and Measurement",
    "topic": "SI Base Units, Scientific Notation & Measuring Instruments",
    "learningObjective": "Distinguish base and derived quantities, calculate with standard SI units, and read precision instruments.",
    "title": "Physical Quantities & Scientific Precision",
    "description": "Master foundational physical measurement systems, SI base standards, vernier calipers, and screw gauge readings.",
    "difficulty": "Easy",
    "xpReward": 100,
    "questions": [
      {
        "id": "q_s1_1",
        "question": "Which of the following is an SI Base Unit?",
        "options": [
          "Newton (N)",
          "Joule (J)",
          "Kilogram (kg)",
          "Watt (W)"
        ],
        "correctIndex": 2,
        "explanation": "Kilogram is one of the 7 fundamental SI base units (along with meter, second, ampere, kelvin, mole, candela). The others are derived.",
        "tags": [
          "physics",
          "si-units"
        ]
      },
      {
        "id": "q_s1_2",
        "question": "What is the least count of a standard Vernier Caliper having 10 vernier divisions?",
        "options": [
          "1 mm",
          "0.1 mm",
          "0.01 mm",
          "0.001 mm"
        ],
        "correctIndex": 1,
        "explanation": "Least count of a vernier caliper = smallest main scale division (1 mm) / number of vernier divisions (10) = 0.1 mm (or 0.01 cm).",
        "tags": [
          "physics",
          "vernier-caliper"
        ]
      },
      {
        "id": "q_s1_3",
        "question": "How is the number 0.00045 expressed in standard scientific notation?",
        "options": [
          "4.5 * 10⁴",
          "4.5 * 10⁻⁴",
          "45 * 10⁻⁵",
          "0.45 * 10⁻³"
        ],
        "correctIndex": 1,
        "explanation": "Scientific notation writes numbers as a * 10^b (where 1 ≤ a < 10). Moving the decimal 4 spots right gives 4.5 * 10⁻⁴.",
        "tags": [
          "physics",
          "scientific-notation"
        ]
      },
      {
        "id": "q_s1_4",
        "question": "Which instrument is most accurate for measuring the diameter of a thin copper wire?",
        "options": [
          "Meter rule",
          "Vernier calipers",
          "Screw gauge (Micrometer)",
          "Measuring tape"
        ],
        "correctIndex": 2,
        "explanation": "A screw gauge has a precision/least count of 0.01 mm (0.001 cm), making it the instrument of choice for tiny diameters like wires.",
        "tags": [
          "physics",
          "measuring-instruments"
        ]
      },
      {
        "id": "q_s1_5",
        "question": "What is the SI unit of density (Mass per unit Volume)?",
        "options": [
          "kg/m",
          "kg/m²",
          "kg/m³",
          "g/cm²"
        ],
        "correctIndex": 2,
        "explanation": "Density = mass / volume. In SI units: kg / m³.",
        "tags": [
          "physics",
          "derived-units"
        ]
      }
    ]
  },
  {
    "id": 8,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 2,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 2,
    "levelName": "Intermediate",
    "chapter": "Kinematics & Motion Dynamics",
    "topic": "Distance vs. Displacement, Speed, Velocity & Acceleration",
    "learningObjective": "Distinguish scalar and vector quantities, compute acceleration using a = (v - u)/t, and interpret motion graphs.",
    "title": "Kinematics: Velocity & Acceleration",
    "description": "Understand the laws governing moving bodies, the distinction between speed and velocity, and uniform acceleration.",
    "difficulty": "Easy",
    "xpReward": 120,
    "questions": [
      {
        "id": "q_s2_1",
        "question": "What key characteristic distinguishes displacement from distance?",
        "options": [
          "Displacement has magnitude only",
          "Displacement is a vector pointing from initial to final position",
          "Distance can be negative, displacement is always positive",
          "Displacement is always greater than distance"
        ],
        "correctIndex": 1,
        "explanation": "Displacement is the shortest straight-line vector from the starting point to the final position, possessing both magnitude and direction.",
        "tags": [
          "physics",
          "kinematics",
          "vectors"
        ]
      },
      {
        "id": "q_s2_2",
        "question": "A car accelerates uniformly from rest to 20 m/s in 5 seconds. What is its acceleration?",
        "options": [
          "4 m/s²",
          "100 m/s²",
          "2 m/s²",
          "5 m/s²"
        ],
        "correctIndex": 0,
        "explanation": "Acceleration a = (v - u) / t = (20 m/s - 0) / 5 s = 4 m/s².",
        "tags": [
          "physics",
          "acceleration"
        ]
      },
      {
        "id": "q_s2_3",
        "question": "What does the slope of a distance-time graph represent?",
        "options": [
          "Acceleration",
          "Speed / Velocity",
          "Force",
          "Displacement"
        ],
        "correctIndex": 1,
        "explanation": "Slope of distance-time graph = change in distance / change in time = speed (or velocity on a displacement-time graph).",
        "tags": [
          "physics",
          "motion-graphs"
        ]
      },
      {
        "id": "q_s2_4",
        "question": "Under ideal free-fall near Earth's surface (ignoring air resistance), what is gravitational acceleration g?",
        "options": [
          "9.8 m/s²",
          "3.14 m/s²",
          "98 m/s²",
          "0 m/s²"
        ],
        "correctIndex": 0,
        "explanation": "Standard acceleration due to Earth's gravity is approximately 9.8 m/s² (commonly rounded to 10 m/s² in some quick calculations).",
        "tags": [
          "physics",
          "gravity",
          "free-fall"
        ]
      },
      {
        "id": "q_s2_5",
        "question": "Which of the following is a pure scalar quantity?",
        "options": [
          "Velocity",
          "Acceleration",
          "Speed",
          "Force"
        ],
        "correctIndex": 2,
        "explanation": "Speed is a scalar quantity (magnitude only, no direction). Velocity, acceleration, and force are all vectors.",
        "tags": [
          "physics",
          "scalars-and-vectors"
        ]
      }
    ]
  },
  {
    "id": 9,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 3,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 3,
    "levelName": "Applied",
    "chapter": "Dynamics & Newton's Laws of Motion",
    "topic": "Inertia, Force (F = ma), Momentum & Action-Reaction",
    "learningObjective": "Apply Newton's three laws of motion and calculate linear momentum p = mv.",
    "title": "Dynamics: Forces & Newton's Laws",
    "description": "Explore the causes of motion: mass as a measure of inertia, force equations, momentum conservation, and friction.",
    "difficulty": "Medium",
    "xpReward": 140,
    "questions": [
      {
        "id": "q_s3_1",
        "question": "Which physical quantity serves as a quantitative measure of an object's inertia?",
        "options": [
          "Velocity",
          "Mass",
          "Volume",
          "Weight"
        ],
        "correctIndex": 1,
        "explanation": "Newton's first law defines inertia as the property of matter to resist changes in its state of motion. Mass is the direct scalar measure of inertia.",
        "tags": [
          "physics",
          "inertia",
          "newtons-first-law"
        ]
      },
      {
        "id": "q_s3_2",
        "question": "What net force is required to accelerate a 5 kg mass at 3 m/s²?",
        "options": [
          "1.67 N",
          "15 N",
          "8 N",
          "45 N"
        ],
        "correctIndex": 1,
        "explanation": "By Newton's second law: F = m * a = 5 kg * 3 m/s² = 15 N.",
        "tags": [
          "physics",
          "force",
          "newtons-second-law"
        ]
      },
      {
        "id": "q_s3_3",
        "question": "When a rifle fires a bullet forward, the rifle recoils backward. Which law explains this?",
        "options": [
          "Newton's First Law",
          "Newton's Second Law",
          "Newton's Third Law",
          "Law of Gravitation"
        ],
        "correctIndex": 2,
        "explanation": "Newton's third law states: to every action there is an equal and opposite reaction. The forward force on the bullet produces an equal backward force on the rifle.",
        "tags": [
          "physics",
          "newtons-third-law",
          "action-reaction"
        ]
      },
      {
        "id": "q_s3_4",
        "question": "What is the linear momentum of an 800 kg car moving at 15 m/s?",
        "options": [
          "12,000 kg·m/s",
          "53.3 kg·m/s",
          "815 kg·m/s",
          "6,000 kg·m/s"
        ],
        "correctIndex": 0,
        "explanation": "Momentum p = mass * velocity = 800 kg * 15 m/s = 12,000 kg·m/s.",
        "tags": [
          "physics",
          "momentum"
        ]
      },
      {
        "id": "q_s3_5",
        "question": "Rolling friction is significantly smaller than sliding friction primarily because:",
        "options": [
          "Rolling objects have no mass",
          "The point of contact between surfaces is momentary and much smaller",
          "Gravity does not act on wheels",
          "Air resistance cancels rolling friction"
        ],
        "correctIndex": 1,
        "explanation": "In rolling motion, surfaces do not rub or scrape continuously past each other; the area of contact is minimal and interlocking microscopic ridges do not shear.",
        "tags": [
          "physics",
          "friction"
        ]
      }
    ]
  },
  {
    "id": 10,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 4,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 3,
    "levelName": "Applied",
    "chapter": "Atomic Structure & Periodic Properties",
    "topic": "Subatomic Particles, Isotopes, Bohr's Model & Electronic Configuration",
    "learningObjective": "Determine atomic number, mass number, electron shell capacity using 2n², and identify isotopes.",
    "title": "Structure of Atoms & Elements",
    "description": "Journey into the atom: protons, neutrons, electron energy levels, Bohr's postulates, and valence electrons.",
    "difficulty": "Medium",
    "xpReward": 160,
    "questions": [
      {
        "id": "q_s4_1",
        "question": "An atom has 11 protons, 12 neutrons, and 11 electrons. What is its Mass Number (A)?",
        "options": [
          "11",
          "12",
          "23",
          "34"
        ],
        "correctIndex": 2,
        "explanation": "Mass Number A = Protons + Neutrons = 11 + 12 = 23 (this is Sodium-23).",
        "tags": [
          "chemistry",
          "atomic-structure",
          "mass-number"
        ]
      },
      {
        "id": "q_s4_2",
        "question": "What is the maximum number of electrons that can occupy the M-shell (n = 3)?",
        "options": [
          "2",
          "8",
          "18",
          "32"
        ],
        "correctIndex": 2,
        "explanation": "Bohr's formula for shell capacity is 2n². For n = 3: 2 * (3)² = 2 * 9 = 18 electrons.",
        "tags": [
          "chemistry",
          "electron-shells",
          "bohr-model"
        ]
      },
      {
        "id": "q_s4_3",
        "question": "Isotopes of the same chemical element possess the same number of:",
        "options": [
          "Neutrons",
          "Protons",
          "Nucleons",
          "Mass units"
        ],
        "correctIndex": 1,
        "explanation": "Isotopes have the identical atomic number (same number of protons and chemical properties) but different numbers of neutrons (different mass numbers).",
        "tags": [
          "chemistry",
          "isotopes"
        ]
      },
      {
        "id": "q_s4_4",
        "question": "Who discovered the atomic nucleus through the historic alpha-particle gold foil experiment?",
        "options": [
          "J.J. Thomson",
          "Ernest Rutherford",
          "John Dalton",
          "Niels Bohr"
        ],
        "correctIndex": 1,
        "explanation": "Rutherford's 1911 gold foil scattering experiment showed alpha particles deflecting at large angles, proving a dense, positively charged nucleus.",
        "tags": [
          "chemistry",
          "rutherford",
          "atomic-theory"
        ]
      },
      {
        "id": "q_s4_5",
        "question": "What is the valence electron count for a neutral Chlorine atom (Atomic Number = 17)?",
        "options": [
          "1",
          "5",
          "7",
          "8"
        ],
        "correctIndex": 2,
        "explanation": "Chlorine's electron configuration is 2, 8, 7. Its outermost shell contains 7 valence electrons.",
        "tags": [
          "chemistry",
          "valence-electrons"
        ]
      }
    ]
  },
  {
    "id": 11,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 5,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 4,
    "levelName": "Advanced",
    "chapter": "Chemical Bonding & Molecular Structure",
    "topic": "Octet Rule, Ionic vs Covalent Bonds, Intermolecular Forces",
    "learningObjective": "Explain chemical bond formation through electron transfer or sharing to achieve stable noble gas octets.",
    "title": "Chemical Bonding & Octet Rule",
    "description": "Understand ionic crystal lattices, shared covalent pairs, electronegativity differences, and molecular stability.",
    "difficulty": "Hard",
    "xpReward": 180,
    "questions": [
      {
        "id": "q_s5_1",
        "question": "Why do atoms undergo chemical bond formation with one another?",
        "options": [
          "To gain higher kinetic energy",
          "To attain a stable noble gas electronic configuration (octet/duplet)",
          "To increase their atomic radius",
          "To destroy their protons"
        ],
        "correctIndex": 1,
        "explanation": "Atoms bond to lower potential energy and achieve stable electronic configurations, typically possessing 8 electrons in their outermost valence shell (octet rule).",
        "tags": [
          "chemistry",
          "chemical-bonding",
          "octet-rule"
        ]
      },
      {
        "id": "q_s5_2",
        "question": "An ionic bond forms primarily through which mechanism?",
        "options": [
          "Mutual sharing of electrons between nonmetals",
          "Complete transfer of one or more electrons from a metal to a nonmetal",
          "Sharing of a single proton",
          "Attraction of neutral molecules"
        ],
        "correctIndex": 1,
        "explanation": "Ionic bonds occur when electropositive metal atoms donate electrons to electronegative nonmetals, producing opposing ions that attract electrostatically (e.g. NaCl).",
        "tags": [
          "chemistry",
          "ionic-bonds"
        ]
      },
      {
        "id": "q_s5_3",
        "question": "In an Oxygen molecule (O₂), how many electron pairs are shared between the two oxygen atoms?",
        "options": [
          "One single pair",
          "Two pairs (Double bond)",
          "Three pairs (Triple bond)",
          "Zero pairs"
        ],
        "correctIndex": 1,
        "explanation": "Each oxygen atom has 6 valence electrons and needs 2 more to complete its octet. They share 2 pairs of electrons, forming a double covalent bond (O=O).",
        "tags": [
          "chemistry",
          "covalent-bonds",
          "double-bond"
        ]
      },
      {
        "id": "q_s5_4",
        "question": "Which of the following compounds exhibits polar covalent bonding?",
        "options": [
          "H₂",
          "Cl₂",
          "H₂O",
          "O₂"
        ],
        "correctIndex": 2,
        "explanation": "In water (H₂O), oxygen has a much higher electronegativity than hydrogen, pulling the shared electron cloud and generating partial charges (δ- on O, δ+ on H).",
        "tags": [
          "chemistry",
          "polar-covalent"
        ]
      },
      {
        "id": "q_s5_5",
        "question": "Ionic compounds generally exhibit high melting points because:",
        "options": [
          "Their molecules are held by weak van der Waals forces",
          "Strong electrostatic forces bind the alternating 3D crystal lattice",
          "They are always liquids at room temperature",
          "They contain free wandering electrons"
        ],
        "correctIndex": 1,
        "explanation": "Tremendous thermal energy is required to overcome the strong continuous electrostatic forces holding oppositely charged cations and anions in a 3D lattice.",
        "tags": [
          "chemistry",
          "ionic-properties"
        ]
      }
    ]
  },
  {
    "id": 12,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 6,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 5,
    "levelName": "Mastery",
    "chapter": "Cell Biology & Living Systems",
    "topic": "Plant vs Animal Cells, Organelles, Membrane Transport & Cell Division",
    "learningObjective": "Compare cell organelles, explain photosynthesis vs respiration, and distinguish mitosis from meiosis.",
    "title": "Cell Biology: Microscopic Engines",
    "description": "Explore the structural units of life: mitochondria, chloroplasts, nucleus, selective permeability, and cell replication.",
    "difficulty": "Hard",
    "xpReward": 200,
    "questions": [
      {
        "id": "q_s6_1",
        "question": "Which organelle is universally termed the 'Powerhouse of the Cell' for ATP synthesis?",
        "options": [
          "Golgi apparatus",
          "Ribosome",
          "Mitochondria",
          "Endoplasmic reticulum"
        ],
        "correctIndex": 2,
        "explanation": "Mitochondria carry out cellular aerobic respiration, converting chemical energy from glucose into universal biological currency (ATP).",
        "tags": [
          "biology",
          "cell-organelles",
          "mitochondria"
        ]
      },
      {
        "id": "q_s6_2",
        "question": "Which organelle is present in plant cells but absent in typical animal cells?",
        "options": [
          "Mitochondria",
          "Cell wall and Chloroplasts",
          "Ribosomes",
          "Cell membrane"
        ],
        "correctIndex": 1,
        "explanation": "Plant cells feature a rigid cellulose cell wall and photosynthetic chloroplasts, which are absent in animal cells.",
        "tags": [
          "biology",
          "plant-cells"
        ]
      },
      {
        "id": "q_s6_3",
        "question": "The process of cell division that results in genetically identical diploid daughter cells is:",
        "options": [
          "Meiosis",
          "Mitosis",
          "Fertilization",
          "Binary decay"
        ],
        "correctIndex": 1,
        "explanation": "Mitosis produces 2 daughter cells with the exact identical chromosome number and genetic sequence for somatic growth and tissue repair.",
        "tags": [
          "biology",
          "mitosis",
          "cell-division"
        ]
      },
      {
        "id": "q_s6_4",
        "question": "What is the green photosynthetic pigment found inside chloroplast thylakoids?",
        "options": [
          "Hemoglobin",
          "Chlorophyll",
          "Melanin",
          "Carotene"
        ],
        "correctIndex": 1,
        "explanation": "Chlorophyll absorbs blue and red wavelengths of solar light to drive photosynthesis, reflecting green light.",
        "tags": [
          "biology",
          "photosynthesis",
          "chlorophyll"
        ]
      },
      {
        "id": "q_s6_5",
        "question": "Passive movement of water molecules across a semi-permeable membrane from low to high solute concentration is:",
        "options": [
          "Active transport",
          "Phagocytosis",
          "Osmosis",
          "Endocytosis"
        ],
        "correctIndex": 2,
        "explanation": "Osmosis is the specialized passive diffusion of water molecules through a selectively permeable membrane towards higher solute concentration.",
        "tags": [
          "biology",
          "osmosis",
          "cell-transport"
        ]
      }
    ]
  },
  {
    "id": 13,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 1,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Grammar & Parts of Speech",
    "topic": "Identifying Nouns, Pronouns, Verbs, Adjectives & Prepositions",
    "learningObjective": "Accurately classify parts of speech and identify their syntactic roles within standard sentences.",
    "title": "Parts of Speech & Syntax Foundations",
    "description": "Analyze the architectural building blocks of the English language: nouns, transitive verbs, and prepositions.",
    "difficulty": "Easy",
    "xpReward": 100,
    "questions": [
      {
        "id": "q_e1_1",
        "question": "In the sentence 'The swift cheetah sprinted across the savanna', what part of speech is 'swift'?",
        "options": [
          "Adverb",
          "Adjective",
          "Noun",
          "Preposition"
        ],
        "correctIndex": 1,
        "explanation": "'Swift' modifies the noun 'cheetah', describing its characteristic quality. Words that modify nouns are adjectives.",
        "tags": [
          "english",
          "parts-of-speech",
          "adjectives"
        ]
      },
      {
        "id": "q_e1_2",
        "question": "Which of the following contains an abstract noun?",
        "options": [
          "Stone",
          "Courage",
          "Table",
          "Laptop"
        ],
        "correctIndex": 1,
        "explanation": "'Courage' represents an intangible idea, quality, or concept that cannot be experienced with the five physical senses, making it an abstract noun.",
        "tags": [
          "english",
          "nouns",
          "abstract-nouns"
        ]
      },
      {
        "id": "q_e1_3",
        "question": "Identify the preposition in: 'She placed the notebook under the wooden desk.'",
        "options": [
          "placed",
          "notebook",
          "under",
          "wooden"
        ],
        "correctIndex": 2,
        "explanation": "'Under' indicates the spatial relationship between the notebook and the desk, serving as the preposition.",
        "tags": [
          "english",
          "prepositions"
        ]
      },
      {
        "id": "q_e1_4",
        "question": "Choose the sentence where 'fast' functions as an adverb:",
        "options": [
          "He drove fast down the mountain road.",
          "She is a fast runner.",
          "They broke their dawn fast.",
          "This is a fast train."
        ],
        "correctIndex": 0,
        "explanation": "In 'He drove fast', 'fast' modifies the action verb 'drove', answering the question 'how did he drive?'.",
        "tags": [
          "english",
          "adverbs"
        ]
      },
      {
        "id": "q_e1_5",
        "question": "Which word in the sentence is a conjunction? 'I wanted to study, yet I fell asleep.'",
        "options": [
          "wanted",
          "yet",
          "fell",
          "asleep"
        ],
        "correctIndex": 1,
        "explanation": "'Yet' is a coordinating conjunction (one of FANBOYS) linking two independent clauses.",
        "tags": [
          "english",
          "conjunctions"
        ]
      }
    ]
  },
  {
    "id": 14,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 2,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 2,
    "levelName": "Intermediate",
    "chapter": "Tenses & Subject-Verb Agreement",
    "topic": "Continuous, Perfect & Indefinite Tenses and Concord Rules",
    "learningObjective": "Select correct verb forms matching singular/plural subjects and maintain temporal consistency.",
    "title": "Tenses & Subject-Verb Agreement",
    "description": "Ensure grammatical harmony between subjects and predicates across past, present, and future perfect tenses.",
    "difficulty": "Easy",
    "xpReward": 120,
    "questions": [
      {
        "id": "q_e2_1",
        "question": "Neither the teacher nor the students ____ present at the seminar yesterday.",
        "options": [
          "was",
          "were",
          "is",
          "are"
        ],
        "correctIndex": 1,
        "explanation": "With correlative conjunctions 'neither...nor', the verb agrees with the closer subject. 'Students' is plural, so past plural 'were' is correct.",
        "tags": [
          "english",
          "subject-verb-agreement",
          "concord"
        ]
      },
      {
        "id": "q_e2_2",
        "question": "Identify the sentence written in the Past Perfect tense:",
        "options": [
          "She was writing an essay.",
          "She wrote an essay yesterday.",
          "She had completed her essay before the bell rang.",
          "She has completed her essay."
        ],
        "correctIndex": 2,
        "explanation": "Past perfect requires 'had + past participle' (had completed), describing an action completed prior to another past event.",
        "tags": [
          "english",
          "tenses",
          "past-perfect"
        ]
      },
      {
        "id": "q_e2_3",
        "question": "The bouquet of vibrant yellow flowers ____ on the kitchen table.",
        "options": [
          "sit",
          "sits",
          "sitting",
          "are sitting"
        ],
        "correctIndex": 1,
        "explanation": "The true subject is the singular noun 'bouquet' (not the plural prepositional object 'flowers'). Therefore, singular verb 'sits' is correct.",
        "tags": [
          "english",
          "subject-verb-agreement"
        ]
      },
      {
        "id": "q_e2_4",
        "question": "By next December, our school ____ its golden jubilee celebrations.",
        "options": [
          "completes",
          "will have completed",
          "completed",
          "had completed"
        ],
        "correctIndex": 1,
        "explanation": "The prepositional phrase 'By next December' specifies a future deadline, requiring the Future Perfect tense 'will have completed'.",
        "tags": [
          "english",
          "future-perfect"
        ]
      },
      {
        "id": "q_e2_5",
        "question": "Ten kilometers ____ a long distance to walk in summer heat.",
        "options": [
          "is",
          "are",
          "were",
          "have been"
        ],
        "correctIndex": 0,
        "explanation": "Measurements of distance, money, and time are treated as single singular quantities when regarded as a unit ('Ten kilometers is').",
        "tags": [
          "english",
          "agreement-units"
        ]
      }
    ]
  },
  {
    "id": 15,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 3,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 3,
    "levelName": "Applied",
    "chapter": "Active and Passive Voice",
    "topic": "Transformation Rules, Agent Identification & By-phrase",
    "learningObjective": "Transform active voice sentences into passive voice without altering essential semantic meaning or tense.",
    "title": "Active & Passive Voice Transformation",
    "description": "Shift focus between the doer and the recipient of an action using standard auxiliary verb transformations.",
    "difficulty": "Medium",
    "xpReward": 140,
    "questions": [
      {
        "id": "q_e3_1",
        "question": "Change to Passive: 'The architect designed the futuristic solar library.'",
        "options": [
          "The futuristic solar library was designed by the architect.",
          "The futuristic solar library is designed by the architect.",
          "The futuristic solar library had been designed by the architect.",
          "The architect was designing the library."
        ],
        "correctIndex": 0,
        "explanation": "Past simple active ('designed') converts to 'was/were + past participle' in passive: 'was designed by the architect'.",
        "tags": [
          "english",
          "passive-voice",
          "past-simple"
        ]
      },
      {
        "id": "q_e3_2",
        "question": "Change to Passive: 'They are constructing a new suspension bridge.'",
        "options": [
          "A new suspension bridge is constructed by them.",
          "A new suspension bridge is being constructed by them.",
          "A new suspension bridge was being constructed by them.",
          "A new suspension bridge has been constructed."
        ],
        "correctIndex": 1,
        "explanation": "Present continuous active ('are constructing') converts to 'is/are + being + past participle': 'is being constructed'.",
        "tags": [
          "english",
          "passive-voice",
          "continuous"
        ]
      },
      {
        "id": "q_e3_3",
        "question": "Change to Passive: 'Close the classroom door immediately.'",
        "options": [
          "You should close the door.",
          "Let the classroom door be closed immediately.",
          "The door has to be closed by you.",
          "Close the door now."
        ],
        "correctIndex": 1,
        "explanation": "Imperative sentences convert to passive using the formula: Let + Object + be + Past Participle ('Let the classroom door be closed immediately').",
        "tags": [
          "english",
          "passive-voice",
          "imperatives"
        ]
      },
      {
        "id": "q_e3_4",
        "question": "Which of the following active sentences CANNOT be transformed into passive voice?",
        "options": [
          "She baked a delicious chocolate cake.",
          "The weary traveler slept soundly.",
          "The company launched a groundbreaking smartphone.",
          "He kicked the football into the goal."
        ],
        "correctIndex": 1,
        "explanation": "'Slept' is an intransitive verb (it takes no direct object). Only transitive verbs with direct objects can be put into passive voice.",
        "tags": [
          "english",
          "transitive-intransitive"
        ]
      },
      {
        "id": "q_e3_5",
        "question": "Change to Active: 'The riddle was solved by the young detective.'",
        "options": [
          "The young detective solves the riddle.",
          "The young detective solved the riddle.",
          "The young detective had solved the riddle.",
          "The young detective is solving the riddle."
        ],
        "correctIndex": 1,
        "explanation": "Converting 'was solved' (past passive) back to active yields past simple: 'The young detective solved the riddle.'",
        "tags": [
          "english",
          "active-voice"
        ]
      }
    ]
  },
  {
    "id": 16,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 4,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 3,
    "levelName": "Applied",
    "chapter": "Direct and Indirect Speech (Narration)",
    "topic": "Reporting Verbs, Backshifting Tenses & Pronoun Changes",
    "learningObjective": "Convert direct quotes into reported speech adhering to tense shifts, pronoun alignments, and time words.",
    "title": "Direct & Indirect Speech (Narration)",
    "description": "Master reported speech: shifting tenses backward in time, modifying modal auxiliaries, and updating reporting verbs.",
    "difficulty": "Medium",
    "xpReward": 160,
    "questions": [
      {
        "id": "q_e4_1",
        "question": "Convert to Indirect: He said, 'I am preparing for my final exam.'",
        "options": [
          "He said that he is preparing for his final exam.",
          "He said that he was preparing for his final exam.",
          "He said that I was preparing for my final exam.",
          "He told he had prepared for his exam."
        ],
        "correctIndex": 1,
        "explanation": "When reporting in past tense ('said'), present continuous ('am preparing') backshifts to past continuous ('was preparing'), and pronouns change (I -> he, my -> his).",
        "tags": [
          "english",
          "narration",
          "indirect-speech"
        ]
      },
      {
        "id": "q_e4_2",
        "question": "In reported speech, what does the direct time adverb 'now' typically become?",
        "options": [
          "then",
          "today",
          "yesterday",
          "tomorrow"
        ],
        "correctIndex": 0,
        "explanation": "In indirect speech, proximity adverbs shift to distance adverbs: 'now' changes to 'then', 'here' to 'there', and 'today' to 'that day'.",
        "tags": [
          "english",
          "narration",
          "time-adverbs"
        ]
      },
      {
        "id": "q_e4_3",
        "question": "Convert: The teacher said to the boy, 'Where do you live?'",
        "options": [
          "The teacher asked the boy where did he live.",
          "The teacher asked the boy where he lived.",
          "The teacher asked the boy where does he live.",
          "The teacher told the boy where he was living."
        ],
        "correctIndex": 1,
        "explanation": "In WH-question indirect speech, the question structure inverts into assertive word order (subject before verb), no 'did' auxiliary: 'where he lived'.",
        "tags": [
          "english",
          "indirect-questions"
        ]
      },
      {
        "id": "q_e4_4",
        "question": "When the reporting verb is in the Present tense (e.g. 'She says...'), the reported clause tense:",
        "options": [
          "Always changes to past",
          "Does not change",
          "Changes to past perfect",
          "Becomes conditional"
        ],
        "correctIndex": 1,
        "explanation": "If the reporting verb is in present or future tense (says, will say), the tense inside the reported clause remains unchanged.",
        "tags": [
          "english",
          "narration-rules"
        ]
      },
      {
        "id": "q_e4_5",
        "question": "Convert: Tariq said, 'Hurrah! We have won the championship trophy!'",
        "options": [
          "Tariq said happily that we won the trophy.",
          "Tariq exclaimed with joy that they had won the championship trophy.",
          "Tariq cheered that they have won the trophy.",
          "Tariq claimed with excitement they won."
        ],
        "correctIndex": 1,
        "explanation": "Exclamatory sentences with 'Hurrah!' convert using 'exclaimed with joy that', and present perfect 'have won' shifts to past perfect 'had won'.",
        "tags": [
          "english",
          "exclamations"
        ]
      }
    ]
  },
  {
    "id": 17,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 5,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 4,
    "levelName": "Advanced",
    "chapter": "Vocabulary & Contextual Nuance",
    "topic": "Synonyms, Antonyms, Connotations & Etymology",
    "learningObjective": "Determine word meanings using contextual clues, identify nuanced connotations, and select precise antonyms.",
    "title": "Vocabulary Precision & Word Power",
    "description": "Expand verbal acuity through contextual clues, Latin/Greek roots, high-frequency academic vocabulary, and tone.",
    "difficulty": "Hard",
    "xpReward": 180,
    "questions": [
      {
        "id": "q_e5_1",
        "question": "Choose the closest synonym for 'Candid':",
        "options": [
          "Secretive",
          "Frank and truthful",
          "Hesitant",
          "Aggressive"
        ],
        "correctIndex": 1,
        "explanation": "'Candid' means straightforward, frank, and sincere in expression without pretense or deception.",
        "tags": [
          "english",
          "vocabulary",
          "synonyms"
        ]
      },
      {
        "id": "q_e5_2",
        "question": "What is the precise antonym of the word 'Diligent'?",
        "options": [
          "Punctual",
          "Indolent (Lazy)",
          "Careful",
          "Persevering"
        ],
        "correctIndex": 1,
        "explanation": "'Diligent' signifies hard-working and conscientious. 'Indolent' means habitually idle, inactive, or lazy.",
        "tags": [
          "english",
          "vocabulary",
          "antonyms"
        ]
      },
      {
        "id": "q_e5_3",
        "question": "What does the Latin root 'bene' mean in words such as 'beneficial', 'benevolent', and 'benediction'?",
        "options": [
          "Bad or harmful",
          "Good or well",
          "Old or ancient",
          "Quick or swift"
        ],
        "correctIndex": 1,
        "explanation": "The Latin root 'bene' means well or good (contrast with 'mal' meaning bad, as in malicious or malevolent).",
        "tags": [
          "english",
          "etymology",
          "prefixes"
        ]
      },
      {
        "id": "q_e5_4",
        "question": "In the sentence 'His ephemeral fame vanished like morning dew', 'ephemeral' means:",
        "options": [
          "Long-lasting",
          "Short-lived / Transitory",
          "Dangerous",
          "Legendary"
        ],
        "correctIndex": 1,
        "explanation": "'Ephemeral' describes something lasting for a very short, fleeting period of time.",
        "tags": [
          "english",
          "context-clues"
        ]
      },
      {
        "id": "q_e5_5",
        "question": "Which of the following pairs represents true Antonyms?",
        "options": [
          "Courteous — Polite",
          "Miserly — Generous",
          "Cautious — Prudent",
          "Damp — Moist"
        ],
        "correctIndex": 1,
        "explanation": "'Miserly' (stingy with resources) is the direct opposite of 'generous' (willing to share liberally).",
        "tags": [
          "english",
          "antonyms"
        ]
      }
    ]
  },
  {
    "id": 18,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 6,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 5,
    "levelName": "Mastery",
    "chapter": "Reading Comprehension & Rhetoric",
    "topic": "Central Themes, Figurative Language, Inferences & Tone",
    "learningObjective": "Synthesize central ideas, discern rhetorical devices (metaphors, similes, personification), and draw valid inferences.",
    "title": "Literary Analysis & Critical Reading",
    "description": "Analyze tone, figurative language, rhetorical strategies, and inferential evidence in critical prose and poetry.",
    "difficulty": "Hard",
    "xpReward": 200,
    "questions": [
      {
        "id": "q_e6_1",
        "question": "What figure of speech is exemplified by: 'The old oak tree stood as a lonely sentinel over the valley'?",
        "options": [
          "Simile",
          "Metaphor",
          "Hyperbole",
          "Alliteration"
        ],
        "correctIndex": 1,
        "explanation": "This is a metaphor because it directly equates the oak tree to a sentinel without using comparison words like 'like' or 'as'.",
        "tags": [
          "english",
          "literary-devices",
          "metaphor"
        ]
      },
      {
        "id": "q_e6_2",
        "question": "Identify the sentence demonstrating Personification:",
        "options": [
          "The autumn wind whispered secrets through the pines.",
          "He was as strong as an ox.",
          "The bag weighed a million tons.",
          "Peter Piper picked a peck of pickled peppers."
        ],
        "correctIndex": 0,
        "explanation": "Personification endows non-human things with human qualities. Here, the 'wind' is depicted as 'whispering secrets'.",
        "tags": [
          "english",
          "personification"
        ]
      },
      {
        "id": "q_e6_3",
        "question": "What is an 'Inference' in reading comprehension?",
        "options": [
          "A sentence copied word-for-word from the text",
          "A logical conclusion drawn from evidence and reasoning rather than explicit mention",
          "The total word count of a paragraph",
          "The alphabetical glossary of terms"
        ],
        "correctIndex": 1,
        "explanation": "An inference is a deduction or logical synthesis reached by reading between the lines based on clues left by the author.",
        "tags": [
          "english",
          "reading-skills",
          "inference"
        ]
      },
      {
        "id": "q_e6_4",
        "question": "If an author's tone is described as 'objective', the writing will primarily be:",
        "options": [
          "Emotionally charged and angry",
          "Fact-based, unbiased, and neutral",
          "Playful and sarcastic",
          "Overwhelmingly nostalgic"
        ],
        "correctIndex": 1,
        "explanation": "An objective tone presents facts, verifiable evidence, and neutral analysis without personal prejudice or emotional coloring.",
        "tags": [
          "english",
          "author-tone"
        ]
      },
      {
        "id": "q_e6_5",
        "question": "'I have told you a thousand times to save your document!' What rhetorical device is used here?",
        "options": [
          "Understatement",
          "Hyperbole",
          "Oxymoron",
          "Irony"
        ],
        "correctIndex": 1,
        "explanation": "Hyperbole is an intentional dramatic exaggeration used for emphasis or comic effect, not intended to be taken literally.",
        "tags": [
          "english",
          "hyperbole"
        ]
      }
    ]
  },
  {
    "id": 19,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 1,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Fundamentals of Computer Systems",
    "topic": "Von Neumann Architecture, CPU Components, RAM vs ROM",
    "learningObjective": "Identify primary functional units of a computer (ALU, CU, Registers) and differentiate volatile and non-volatile memory.",
    "title": "Computer Architecture & Hardware Systems",
    "description": "Explore the core components of computing: the Central Processing Unit, memory hierarchies, and the machine cycle.",
    "difficulty": "Easy",
    "xpReward": 100,
    "questions": [
      {
        "id": "q_c1_1",
        "question": "Which component of the Central Processing Unit (CPU) performs arithmetic and logical evaluations?",
        "options": [
          "Control Unit (CU)",
          "Arithmetic Logic Unit (ALU)",
          "Cache Memory",
          "Program Counter"
        ],
        "correctIndex": 1,
        "explanation": "The ALU (Arithmetic Logic Unit) executes mathematical computations (addition, subtraction) and logical comparisons (AND, OR, NOT).",
        "tags": [
          "computer-science",
          "cpu",
          "alu"
        ]
      },
      {
        "id": "q_c1_2",
        "question": "Why is Random Access Memory (RAM) categorized as 'volatile' memory?",
        "options": [
          "It can catch fire easily",
          "Its contents are permanently etched during factory manufacturing",
          "It loses all stored data immediately when electrical power is turned off",
          "It can only be read, never written"
        ],
        "correctIndex": 2,
        "explanation": "Volatile memory requires continuous electrical power to sustain its state; switching off power clears RAM contents.",
        "tags": [
          "computer-science",
          "ram",
          "volatile-memory"
        ]
      },
      {
        "id": "q_c1_3",
        "question": "What is stored in ROM (Read-Only Memory) to initiate computer startup?",
        "options": [
          "Video games",
          "BIOS / UEFI firmware",
          "User word documents",
          "Web browser history"
        ],
        "correctIndex": 1,
        "explanation": "ROM contains permanent, non-volatile firmware (such as BIOS/UEFI) required to execute the Power-On Self-Test (POST) and boot the OS.",
        "tags": [
          "computer-science",
          "rom",
          "bios"
        ]
      },
      {
        "id": "q_c1_4",
        "question": "What are the four repeating stages of the CPU instruction cycle?",
        "options": [
          "Click, Type, View, Print",
          "Fetch, Decode, Execute, Store",
          "Compile, Run, Debug, Error",
          "Input, Process, Output, Delete"
        ],
        "correctIndex": 1,
        "explanation": "The core machine cycle executed by the processor is: Fetch the instruction from memory, Decode the opcode, Execute the operation, and Store back results.",
        "tags": [
          "computer-science",
          "machine-cycle"
        ]
      },
      {
        "id": "q_c1_5",
        "question": "Which of the following is considered system software rather than application software?",
        "options": [
          "Microsoft Word",
          "Google Chrome",
          "Linux Operating System",
          "Adobe Photoshop"
        ],
        "correctIndex": 2,
        "explanation": "An Operating System (like Linux, Windows, macOS) is system software managing hardware resources and providing a platform for application software.",
        "tags": [
          "computer-science",
          "system-software"
        ]
      }
    ]
  },
  {
    "id": 20,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 2,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 2,
    "levelName": "Intermediate",
    "chapter": "Data Representation & Number Systems",
    "topic": "Binary, Decimal, Hexadecimal & Character Encoding (ASCII/Unicode)",
    "learningObjective": "Convert between binary, decimal, and hexadecimal representations and understand byte-level digital encoding.",
    "title": "Binary Logic & Number Systems",
    "description": "Discover how computers encode all numbers, text, images, and instructions using binary switches and hexadecimal shortcuts.",
    "difficulty": "Easy",
    "xpReward": 120,
    "questions": [
      {
        "id": "q_c2_1",
        "question": "What is the decimal equivalent of the binary number (1011)₂?",
        "options": [
          "9",
          "11",
          "13",
          "15"
        ],
        "correctIndex": 1,
        "explanation": "Evaluate by powers of 2: (1 * 2³) + (0 * 2²) + (1 * 2¹) + (1 * 2⁰) = 8 + 0 + 2 + 1 = 11.",
        "tags": [
          "computer-science",
          "binary-conversion"
        ]
      },
      {
        "id": "q_c2_2",
        "question": "How many bits are grouped together to form one Byte?",
        "options": [
          "4 bits",
          "8 bits",
          "16 bits",
          "32 bits"
        ],
        "correctIndex": 1,
        "explanation": "1 Byte = 8 bits (a group of 4 bits is called a nibble).",
        "tags": [
          "computer-science",
          "bits-and-bytes"
        ]
      },
      {
        "id": "q_c2_3",
        "question": "What base is used by the Hexadecimal number system?",
        "options": [
          "Base 2",
          "Base 8",
          "Base 10",
          "Base 16"
        ],
        "correctIndex": 3,
        "explanation": "Hexadecimal is a base-16 positional system employing digits 0–9 and letters A–F (where A=10, B=11, C=12, D=13, E=14, F=15).",
        "tags": [
          "computer-science",
          "hexadecimal"
        ]
      },
      {
        "id": "q_c2_4",
        "question": "What is the binary representation of the decimal number 13?",
        "options": [
          "1101",
          "1011",
          "1110",
          "1001"
        ],
        "correctIndex": 0,
        "explanation": "13 = 8 + 4 + 1 = (1 * 2³) + (1 * 2²) + (0 * 2¹) + (1 * 2⁰) = (1101)₂.",
        "tags": [
          "computer-science",
          "decimal-to-binary"
        ]
      },
      {
        "id": "q_c2_5",
        "question": "Standard 7-bit ASCII character encoding can represent a maximum of how many distinct characters?",
        "options": [
          "64",
          "128",
          "256",
          "512"
        ],
        "correctIndex": 1,
        "explanation": "With 7 bits, total unique combinations = 2⁷ = 128 distinct characters (codes 0 to 127).",
        "tags": [
          "computer-science",
          "ascii",
          "encoding"
        ]
      }
    ]
  },
  {
    "id": 21,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 3,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 3,
    "levelName": "Applied",
    "chapter": "Computational Thinking & Flowcharts",
    "topic": "Algorithm Design, Standard Flowchart Symbols & Decomposition",
    "learningObjective": "Construct step-by-step algorithms and recognize standard flowchart symbols for terminals, I/O, process, and decision.",
    "title": "Algorithms & Flowchart Logic",
    "description": "Design efficient procedural algorithms and model logic visually using standard ISO/ANSI flowchart geometric conventions.",
    "difficulty": "Medium",
    "xpReward": 140,
    "questions": [
      {
        "id": "q_c3_1",
        "question": "Which geometric symbol is used in flowcharts to denote a Decision (conditional test)?",
        "options": [
          "Rectangle",
          "Oval",
          "Diamond (Rhombus)",
          "Parallelogram"
        ],
        "correctIndex": 2,
        "explanation": "A diamond symbol represents a branching decision having two or more alternative exit paths (e.g., True/False, Yes/No).",
        "tags": [
          "computer-science",
          "flowcharts",
          "algorithms"
        ]
      },
      {
        "id": "q_c3_2",
        "question": "In standard flowcharts, what does a Parallelogram symbol indicate?",
        "options": [
          "Process / Calculation",
          "Input or Output operation",
          "Start or End terminal",
          "Subroutine call"
        ],
        "correctIndex": 1,
        "explanation": "Parallelograms designate data Input or Output operations (e.g. Read X, Print Y).",
        "tags": [
          "computer-science",
          "flowchart-symbols"
        ]
      },
      {
        "id": "q_c3_3",
        "question": "What is an 'Algorithm' in computer science?",
        "options": [
          "A programming language like Python",
          "A step-by-step, finite sequence of unambiguous instructions to solve a problem",
          "A piece of computer hardware that stores data",
          "An accidental coding bug"
        ],
        "correctIndex": 1,
        "explanation": "An algorithm is a well-defined, finite, ordered sequence of instructions designed to perform a computation or solve a class of problems.",
        "tags": [
          "computer-science",
          "algorithms"
        ]
      },
      {
        "id": "q_c3_4",
        "question": "The process of breaking a complex problem into smaller, manageable sub-problems is called:",
        "options": [
          "Decomposition",
          "Abstraction",
          "Compilation",
          "Iteration"
        ],
        "correctIndex": 0,
        "explanation": "Decomposition is a foundational computational thinking pillar where large systems are broken down into simpler constituent parts.",
        "tags": [
          "computer-science",
          "computational-thinking"
        ]
      },
      {
        "id": "q_c3_5",
        "question": "Which flowchart shape indicates Start or Stop of the program?",
        "options": [
          "Circle",
          "Oval / Rounded Rectangle (Terminal)",
          "Triangle",
          "Hexagon"
        ],
        "correctIndex": 1,
        "explanation": "An oval or flat capsule represents a Terminal symbol, explicitly marking where flow begins and terminates.",
        "tags": [
          "computer-science",
          "flowchart-terminal"
        ]
      }
    ]
  },
  {
    "id": 22,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 4,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 3,
    "levelName": "Applied",
    "chapter": "Programming Basics & Data Types",
    "topic": "Variables, Primitive Types (int, float, string, bool) & Operators",
    "learningObjective": "Declare variables, select appropriate data types, and evaluate arithmetic and boolean comparison expressions.",
    "title": "Variables, Types & Operations",
    "description": "Write structured code primitives: memory allocation with variables, strong type concepts, and logical operators.",
    "difficulty": "Medium",
    "xpReward": 160,
    "questions": [
      {
        "id": "q_c4_1",
        "question": "Which data type is best suited to store a student's final examination percentage of 87.5%?",
        "options": [
          "Integer (int)",
          "Floating Point (float)",
          "Boolean (bool)",
          "Character (char)"
        ],
        "correctIndex": 1,
        "explanation": "Floating-point numbers (float/double) represent numbers with fractional/decimal values. Integers store whole numbers only.",
        "tags": [
          "programming",
          "data-types",
          "float"
        ]
      },
      {
        "id": "q_c4_2",
        "question": "What is the result of the logical operation: (True AND False)?",
        "options": [
          "True",
          "False",
          "None",
          "Error"
        ],
        "correctIndex": 1,
        "explanation": "The AND operator evaluates to True only when BOTH operands are True. Since one operand is False, the result is False.",
        "tags": [
          "programming",
          "boolean-logic"
        ]
      },
      {
        "id": "q_c4_3",
        "question": "What does the modulus operator (%) compute in most programming languages?",
        "options": [
          "Quotient division",
          "Remainder of integer division",
          "Square root",
          "Percentage multiplication"
        ],
        "correctIndex": 1,
        "explanation": "Modulus returns the remainder: e.g. 14 % 4 = 2 (since 4 * 3 = 12 with 2 remaining).",
        "tags": [
          "programming",
          "operators",
          "modulus"
        ]
      },
      {
        "id": "q_c4_4",
        "question": "What happens when you declare a variable as a 'Constant'?",
        "options": [
          "Its value changes continuously",
          "Its value cannot be reassigned or modified after initialization",
          "It gets deleted when you read it",
          "It can only store negative numbers"
        ],
        "correctIndex": 1,
        "explanation": "Constants (e.g. const in JS or C) designate read-only identifiers whose bound values cannot be altered during execution.",
        "tags": [
          "programming",
          "constants"
        ]
      },
      {
        "id": "q_c4_5",
        "question": "Which of the following is a VALID identifier name according to standard programming rules?",
        "options": [
          "2ndStudent",
          "total_score",
          "class-name",
          "student score"
        ],
        "correctIndex": 1,
        "explanation": "Identifiers cannot start with a digit, cannot contain hyphens (interpreted as minus) or spaces. 'total_score' uses valid letters and underscores.",
        "tags": [
          "programming",
          "identifiers"
        ]
      }
    ]
  },
  {
    "id": 23,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 5,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 4,
    "levelName": "Advanced",
    "chapter": "Control Structures: Branches & Loops",
    "topic": "If-Else Branching, While Loops, For Loops & Iteration Control",
    "learningObjective": "Trace conditional branches and determine iteration count and termination conditions in loops.",
    "title": "Branching Logic & Iterative Loops",
    "description": "Control program flow using nested decisions, counter-controlled loops, condition checks, and infinite loop prevention.",
    "difficulty": "Hard",
    "xpReward": 180,
    "questions": [
      {
        "id": "q_c5_1",
        "question": "How many times will a loop with header 'for (int i = 0; i < 5; i++)' execute?",
        "options": [
          "4 times",
          "5 times",
          "6 times",
          "0 times"
        ],
        "correctIndex": 1,
        "explanation": "The loop variable i takes values: 0, 1, 2, 3, 4. When i becomes 5, condition (5 < 5) evaluates to False, executing exactly 5 iterations.",
        "tags": [
          "programming",
          "loops",
          "iteration"
        ]
      },
      {
        "id": "q_c5_2",
        "question": "What critical flaw occurs if a While loop's condition never becomes False?",
        "options": [
          "Syntax Error",
          "Infinite Loop / Freeze",
          "Automatic computer shutdown",
          "Compiler warning only"
        ],
        "correctIndex": 1,
        "explanation": "An infinite loop occurs when loop body logic fails to advance the state toward the termination condition, causing continuous execution.",
        "tags": [
          "programming",
          "infinite-loop"
        ]
      },
      {
        "id": "q_c5_3",
        "question": "Which control statement immediately terminates loop execution and transfers flow to the next statement outside?",
        "options": [
          "continue",
          "break",
          "return",
          "pass"
        ],
        "correctIndex": 1,
        "explanation": "The 'break' keyword immediately exits the innermost enclosing loop or switch block.",
        "tags": [
          "programming",
          "control-flow",
          "break"
        ]
      },
      {
        "id": "q_c5_4",
        "question": "In an If-Else If-Else structure, how many conditional blocks will execute?",
        "options": [
          "All blocks whose conditions are True",
          "At most one block (the first matching condition or fallback else)",
          "Always exactly two blocks",
          "None"
        ],
        "correctIndex": 1,
        "explanation": "An If-Else ladder is mutually exclusive: once the first condition evaluates to True, its block runs and all remaining branches are skipped.",
        "tags": [
          "programming",
          "conditional-branching"
        ]
      },
      {
        "id": "q_c5_5",
        "question": "What is an array in programming?",
        "options": [
          "A single character variable",
          "A contiguous collection of elements of the same data type stored in indexed memory",
          "A type of physical computer cable",
          "A software license"
        ],
        "correctIndex": 1,
        "explanation": "An array is a data structure storing a fixed-size sequential collection of homogeneous elements accessible by zero-based indices.",
        "tags": [
          "programming",
          "arrays"
        ]
      }
    ]
  },
  {
    "id": 24,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 6,
    "grade": "grade_9",
    "gradeLabel": "Grade 9 / Class 9",
    "level": 5,
    "levelName": "Mastery",
    "chapter": "Computer Networks & Cybersecurity",
    "topic": "LAN vs WAN, IP Addresses, Firewalls, Malware & Digital Safety",
    "learningObjective": "Distinguish network topologies, explain the purpose of IP addressing, and identify common cyber threats and countermeasures.",
    "title": "Networks, Cybersecurity & Ethics",
    "description": "Examine modern digital infrastructure: Local Area Networks, the global Internet, encryption, firewalls, and data privacy.",
    "difficulty": "Hard",
    "xpReward": 200,
    "questions": [
      {
        "id": "q_c6_1",
        "question": "What network classification best describes computers connected inside a single school computer laboratory?",
        "options": [
          "WAN (Wide Area Network)",
          "LAN (Local Area Network)",
          "MAN (Metropolitan Area Network)",
          "VPN"
        ],
        "correctIndex": 1,
        "explanation": "A Local Area Network (LAN) spans a geographically confined area like a room, single building, or school campus.",
        "tags": [
          "networking",
          "lan",
          "network-types"
        ]
      },
      {
        "id": "q_c6_2",
        "question": "What is the primary role of a Network Firewall?",
        "options": [
          "To speed up Internet download bandwidth",
          "To monitor and filter incoming and outgoing network traffic based on security rules",
          "To cool down computer processors",
          "To format defective hard drives"
        ],
        "correctIndex": 1,
        "explanation": "A firewall inspects packet headers and data against defined security policies, blocking unauthorized access from external networks.",
        "tags": [
          "cybersecurity",
          "firewall"
        ]
      },
      {
        "id": "q_c6_3",
        "question": "A deceptive email pretending to be from an official bank asking for your password and OTP is an example of:",
        "options": [
          "Phishing",
          "DDoS attack",
          "Computer Worm",
          "SQL Injection"
        ],
        "correctIndex": 0,
        "explanation": "Phishing is a social engineering attack that tricks individuals into revealing confidential credentials through fraudulent communications.",
        "tags": [
          "cybersecurity",
          "phishing"
        ]
      },
      {
        "id": "q_c6_4",
        "question": "What is the unique numerical identifier assigned to every device connected to an IP computer network?",
        "options": [
          "MAC Address only",
          "IP Address",
          "URL path",
          "HTML tag"
        ],
        "correctIndex": 1,
        "explanation": "An IP (Internet Protocol) address (e.g. IPv4 192.168.1.1 or IPv6) identifies host network interfaces and facilitates packet routing.",
        "tags": [
          "networking",
          "ip-address"
        ]
      },
      {
        "id": "q_c6_5",
        "question": "The process of converting readable plaintext into scrambled ciphertext to prevent unauthorized snooping is:",
        "options": [
          "Defragmentation",
          "Encryption",
          "Compression",
          "Rendering"
        ],
        "correctIndex": 1,
        "explanation": "Encryption utilizes cryptographic mathematical keys to protect confidentiality so that only parties possessing the decryption key can read it.",
        "tags": [
          "cybersecurity",
          "encryption"
        ]
      }
    ]
  },
  {
    "id": 101,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 1,
    "grade": "grade_10",
    "gradeLabel": "Grade 10 / Matric",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Quadratic Equations",
    "topic": "Standard Form ax² + bx + c = 0 & Quadratic Formula",
    "learningObjective": "Identify quadratic coefficients and solve second-degree equations using the quadratic formula.",
    "title": "Quadratic Equations & Roots",
    "description": "Explore quadratic equations in standard form, discriminants, and finding roots with x = (-b ± √(b² - 4ac)) / (2a).",
    "difficulty": "Medium",
    "xpReward": 120,
    "questions": [
      {
        "id": "q_10_m1_1",
        "question": "What is the degree of a Quadratic Equation?",
        "options": [
          "1",
          "2",
          "3",
          "0"
        ],
        "correctIndex": 1,
        "explanation": "A quadratic equation is a polynomial equation of second degree (highest power of variable is 2).",
        "tags": [
          "matric-math",
          "quadratics"
        ]
      },
      {
        "id": "q_10_m1_2",
        "question": "In standard quadratic form ax² + bx + c = 0, what is the discriminant formula?",
        "options": [
          "b² - 4ac",
          "b² + 4ac",
          "√(b - 4ac)",
          "2a / b"
        ],
        "correctIndex": 0,
        "explanation": "The discriminant is D = b² - 4ac, which determines the nature of roots (real, equal, or complex).",
        "tags": [
          "matric-math",
          "discriminant"
        ]
      },
      {
        "id": "q_10_m1_3",
        "question": "If the discriminant b² - 4ac = 0, what can be deduced about the roots?",
        "options": [
          "Roots are imaginary",
          "Roots are real and distinct",
          "Roots are real and equal",
          "No roots exist"
        ],
        "correctIndex": 2,
        "explanation": "When D = 0, the plus-or-minus term vanishes, yielding a single repeated real root: -b / (2a).",
        "tags": [
          "matric-math",
          "nature-of-roots"
        ]
      },
      {
        "id": "q_10_m1_4",
        "question": "Solve x² - 9 = 0. The roots are:",
        "options": [
          "x = 3",
          "x = -3",
          "x = ±3",
          "x = 9"
        ],
        "correctIndex": 2,
        "explanation": "x² = 9 => x = ±√9 = ±3.",
        "tags": [
          "matric-math",
          "roots"
        ]
      },
      {
        "id": "q_10_m1_5",
        "question": "What are the roots of x² - 5x + 6 = 0?",
        "options": [
          "2 and 3",
          "-2 and -3",
          "1 and 6",
          "-1 and -6"
        ],
        "correctIndex": 0,
        "explanation": "Factoring yields (x - 2)(x - 3) = 0 => x = 2 and x = 3.",
        "tags": [
          "matric-math",
          "factoring"
        ]
      }
    ]
  },
  {
    "id": 102,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 1,
    "grade": "grade_10",
    "gradeLabel": "Grade 10 / Matric",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Current Electricity",
    "topic": "Electric Current, Ohm's Law (V = IR) & Resistance",
    "learningObjective": "State Ohm's Law, compute resistance, and distinguish series vs parallel circuits.",
    "title": "Current Electricity & Ohm's Law",
    "description": "Investigate electrical charge flows, potential difference, resistance, and circuit configurations.",
    "difficulty": "Medium",
    "xpReward": 120,
    "questions": [
      {
        "id": "q_10_s1_1",
        "question": "State Ohm's Law relationship between voltage V, current I, and resistance R:",
        "options": [
          "V = I / R",
          "V = I * R",
          "I = V * R",
          "R = V * I"
        ],
        "correctIndex": 1,
        "explanation": "Ohm's Law states potential difference is directly proportional to current: V = I * R.",
        "tags": [
          "matric-science",
          "ohms-law"
        ]
      },
      {
        "id": "q_10_s1_2",
        "question": "What is the SI unit of electrical resistance?",
        "options": [
          "Ampere (A)",
          "Volt (V)",
          "Ohm (Ω)",
          "Coulomb (C)"
        ],
        "correctIndex": 2,
        "explanation": "Resistance is measured in Ohms (symbolized by Greek capital letter Omega, Ω).",
        "tags": [
          "matric-science",
          "units"
        ]
      },
      {
        "id": "q_10_s1_3",
        "question": "If two resistors of 4 Ω and 6 Ω are connected in SERIES, the equivalent resistance is:",
        "options": [
          "2.4 Ω",
          "10 Ω",
          "24 Ω",
          "2 Ω"
        ],
        "correctIndex": 1,
        "explanation": "For series resistors, resistances add directly: R_total = R₁ + R₂ = 4 + 6 = 10 Ω.",
        "tags": [
          "matric-science",
          "series-circuits"
        ]
      },
      {
        "id": "q_10_s1_4",
        "question": "Which instrument must always be connected in PARALLEL across a component to measure voltage?",
        "options": [
          "Ammeter",
          "Voltmeter",
          "Galvanometer",
          "Rheostat"
        ],
        "correctIndex": 1,
        "explanation": "A voltmeter has high internal resistance and is connected in parallel to measure potential difference across components.",
        "tags": [
          "matric-science",
          "measuring-instruments"
        ]
      },
      {
        "id": "q_10_s1_5",
        "question": "The rate of flow of electric charge (Q / t) is defined as:",
        "options": [
          "Electric Potential",
          "Electric Current",
          "Capacitance",
          "Inductance"
        ],
        "correctIndex": 1,
        "explanation": "Electric current I = Q / t, measured in Amperes (1 Coulomb per second).",
        "tags": [
          "matric-science",
          "current"
        ]
      }
    ]
  },
  {
    "id": 103,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 1,
    "grade": "grade_10",
    "gradeLabel": "Grade 10 / Matric",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Clauses & Complex Sentences",
    "topic": "Independent vs Dependent Clauses & Conditionals",
    "learningObjective": "Distinguish subordinating clauses and apply Type 1 and Type 2 conditional structures.",
    "title": "Clauses & Conditional Structures",
    "description": "Construct complex sentences using dependent relative clauses and master 'if' conditional constructions.",
    "difficulty": "Medium",
    "xpReward": 120,
    "questions": [
      {
        "id": "q_10_e1_1",
        "question": "Identify the dependent (subordinate) clause in: 'Although it was raining, the players continued the football match.'",
        "options": [
          "the players continued the football match",
          "Although it was raining",
          "continued the football match",
          "football match"
        ],
        "correctIndex": 1,
        "explanation": "'Although it was raining' starts with subordinating conjunction 'Although' and cannot stand alone as a complete sentence.",
        "tags": [
          "matric-english",
          "clauses"
        ]
      },
      {
        "id": "q_10_e1_2",
        "question": "Complete the First Conditional sentence: 'If you study hard, you ____ top the examination.'",
        "options": [
          "will",
          "would",
          "would have",
          "had"
        ],
        "correctIndex": 0,
        "explanation": "First conditional uses: If + Present Simple, will + base verb ('If you study... you will top').",
        "tags": [
          "matric-english",
          "conditionals"
        ]
      },
      {
        "id": "q_10_e1_3",
        "question": "Which sentence illustrates a Second Conditional (hypothetical situation)?",
        "options": [
          "If it rains, we will stay home.",
          "If I won a lottery, I would build a free school.",
          "If you heat ice, it melts.",
          "If they had arrived earlier, they would have caught the train."
        ],
        "correctIndex": 1,
        "explanation": "Second conditional uses: If + Past Simple, would + base verb ('If I won... I would build').",
        "tags": [
          "matric-english",
          "conditionals"
        ]
      },
      {
        "id": "q_10_e1_4",
        "question": "A clause that contains both a subject and a predicate and expresses a complete thought is an:",
        "options": [
          "Adverbial clause",
          "Independent clause",
          "Relative clause",
          "Noun clause"
        ],
        "correctIndex": 1,
        "explanation": "An independent clause forms a complete sentence on its own.",
        "tags": [
          "matric-english",
          "independent-clauses"
        ]
      },
      {
        "id": "q_10_e1_5",
        "question": "Choose the correct relative pronoun: 'The scientist ____ discovered the vaccine received global acclaim.'",
        "options": [
          "which",
          "who",
          "whom",
          "whose"
        ],
        "correctIndex": 1,
        "explanation": "'Who' is the subject relative pronoun referring to human persons.",
        "tags": [
          "matric-english",
          "relative-pronouns"
        ]
      }
    ]
  },
  {
    "id": 104,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 1,
    "grade": "grade_10",
    "gradeLabel": "Grade 10 / Matric",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Introduction to C Programming",
    "topic": "Structure of a C Program, main() Function & Header Files",
    "learningObjective": "Recognize basic C syntax, #include preprocessor directives, and standard I/O library functions.",
    "title": "C Programming Foundations",
    "description": "Write structured C code: header files (#include <stdio.h>), main() entry points, printf(), and return statements.",
    "difficulty": "Medium",
    "xpReward": 120,
    "questions": [
      {
        "id": "q_10_c1_1",
        "question": "Which header file is required in C to use standard input/output functions like printf() and scanf()?",
        "options": [
          "<math.h>",
          "<conio.h>",
          "<stdio.h>",
          "<stdlib.h>"
        ],
        "correctIndex": 2,
        "explanation": "<stdio.h> stands for Standard Input Output header, declaring functions like printf() and scanf().",
        "tags": [
          "matric-cs",
          "c-language"
        ]
      },
      {
        "id": "q_10_c1_2",
        "question": "Every standard C program execution begins at which compulsory function?",
        "options": [
          "start()",
          "main()",
          "run()",
          "init()"
        ],
        "correctIndex": 1,
        "explanation": "Execution always begins at the main() function in C and C++.",
        "tags": [
          "matric-cs",
          "main-function"
        ]
      },
      {
        "id": "q_10_c1_3",
        "question": "What punctuation character must terminate every statement in a C program?",
        "options": [
          "Colon (:)",
          "Period (.)",
          "Semicolon (;)",
          "Comma (,)"
        ],
        "correctIndex": 2,
        "explanation": "Statements in C are terminated with a semicolon (;). Omitting it produces a compilation syntax error.",
        "tags": [
          "matric-cs",
          "syntax"
        ]
      },
      {
        "id": "q_10_c1_4",
        "question": "Which format specifier is used in printf() to display an integer value?",
        "options": [
          "%f",
          "%c",
          "%d",
          "%s"
        ],
        "correctIndex": 2,
        "explanation": "%d (or %i) is the format specifier for signed decimal integers in C.",
        "tags": [
          "matric-cs",
          "format-specifiers"
        ]
      },
      {
        "id": "q_10_c1_5",
        "question": "How are single-line comments written in modern C?",
        "options": [
          "# Comment",
          "// Comment",
          "/* Comment */",
          "<!-- Comment -->"
        ],
        "correctIndex": 1,
        "explanation": "// starts a single line comment in C99 and later. /* ... */ handles multi-line blocks.",
        "tags": [
          "matric-cs",
          "comments"
        ]
      }
    ]
  },
  {
    "id": 201,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 1,
    "grade": "grade_11",
    "gradeLabel": "Grade 11 / 1st Year",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Trigonometric Functions & Identities",
    "topic": "Radian Measure, Fundamental Pythagorean Identities",
    "learningObjective": "Convert degrees to radians and apply sin²θ + cos²θ = 1 and 1 + tan²θ = sec²θ.",
    "title": "Trigonometric Identities & Functions",
    "description": "Deepen circular trigonometry: radian measure, unit circle symmetry, and fundamental trigonometric proofs.",
    "difficulty": "Hard",
    "xpReward": 150,
    "questions": [
      {
        "id": "q_11_m1_1",
        "question": "How many radians are equivalent to 180 degrees?",
        "options": [
          "π / 2",
          "π",
          "2π",
          "3π / 2"
        ],
        "correctIndex": 1,
        "explanation": "180° = π radians (approximately 3.14159 radians).",
        "tags": [
          "inter-math",
          "radians"
        ]
      },
      {
        "id": "q_11_m1_2",
        "question": "What is the fundamental Pythagorean identity relating sine and cosine?",
        "options": [
          "sin²θ - cos²θ = 1",
          "sin²θ + cos²θ = 1",
          "tan²θ + cos²θ = 1",
          "sinθ * cosθ = 1"
        ],
        "correctIndex": 1,
        "explanation": "For all angles θ, sin²θ + cos²θ = 1.",
        "tags": [
          "inter-math",
          "trig-identities"
        ]
      },
      {
        "id": "q_11_m1_3",
        "question": "What is the reciprocal function of cos(θ)?",
        "options": [
          "sec(θ)",
          "csc(θ)",
          "cot(θ)",
          "tan(θ)"
        ],
        "correctIndex": 0,
        "explanation": "sec(θ) = 1 / cos(θ). csc(θ) is the reciprocal of sin(θ).",
        "tags": [
          "inter-math",
          "reciprocal-functions"
        ]
      },
      {
        "id": "q_11_m1_4",
        "question": "Simplify: (1 + tan²θ).",
        "options": [
          "cot²θ",
          "sec²θ",
          "csc²θ",
          "sin²θ"
        ],
        "correctIndex": 1,
        "explanation": "By dividing sin²θ + cos²θ = 1 by cos²θ, we obtain tan²θ + 1 = sec²θ.",
        "tags": [
          "inter-math",
          "pythagorean-identities"
        ]
      },
      {
        "id": "q_11_m1_5",
        "question": "What is the exact value of sin(30°)?",
        "options": [
          "1/2",
          "√3/2",
          "1/√2",
          "1"
        ],
        "correctIndex": 0,
        "explanation": "sin(30°) = sin(π/6) = 1/2.",
        "tags": [
          "inter-math",
          "standard-angles"
        ]
      }
    ]
  },
  {
    "id": 202,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 1,
    "grade": "grade_11",
    "gradeLabel": "Grade 11 / 1st Year",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Vectors & Equilibrium",
    "topic": "Vector Components, Dot Product & Cross Product",
    "learningObjective": "Resolve vectors into rectangular components and compute scalar (dot) and vector (cross) products.",
    "title": "Vectors & Static Equilibrium",
    "description": "Analyze vector algebra in 3D: unit vectors (i, j, k), scalar products (A · B = AB cos θ), and torque conditions.",
    "difficulty": "Hard",
    "xpReward": 150,
    "questions": [
      {
        "id": "q_11_s1_1",
        "question": "If two non-zero vectors A and B are perpendicular to each other, their scalar (dot) product A · B is:",
        "options": [
          "1",
          "0",
          "-1",
          "AB"
        ],
        "correctIndex": 1,
        "explanation": "A · B = |A||B| cos(90°) = 0, because cos(90°) = 0.",
        "tags": [
          "inter-physics",
          "dot-product"
        ]
      },
      {
        "id": "q_11_s1_2",
        "question": "What is the result of the vector cross product i × j for standard Cartesian unit vectors?",
        "options": [
          "k",
          "-k",
          "0",
          "1"
        ],
        "correctIndex": 0,
        "explanation": "Following the right-hand rule in cyclic order: i × j = k, j × k = i, k × i = j.",
        "tags": [
          "inter-physics",
          "cross-product"
        ]
      },
      {
        "id": "q_11_s1_3",
        "question": "What is the First Condition of Equilibrium for a rigid body?",
        "options": [
          "Total torque Στ = 0",
          "Total net force ΣF = 0",
          "Total energy ΣE = 0",
          "Velocity must be 100 m/s"
        ],
        "correctIndex": 1,
        "explanation": "First condition states vector sum of all external forces acting on the body must be zero: ΣF = 0 (translational equilibrium).",
        "tags": [
          "inter-physics",
          "equilibrium"
        ]
      },
      {
        "id": "q_11_s1_4",
        "question": "What physical quantity is defined as the turning effect of a force (τ = r × F)?",
        "options": [
          "Work",
          "Torque (Moment of force)",
          "Power",
          "Momentum"
        ],
        "correctIndex": 1,
        "explanation": "Torque τ = r × F is the vector cross product of position vector and applied force.",
        "tags": [
          "inter-physics",
          "torque"
        ]
      },
      {
        "id": "q_11_s1_5",
        "question": "What is the magnitude of unit vector i + j + k?",
        "options": [
          "1",
          "3",
          "√3",
          "√2"
        ],
        "correctIndex": 2,
        "explanation": "|v| = √(1² + 1² + 1²) = √3.",
        "tags": [
          "inter-physics",
          "vector-magnitude"
        ]
      }
    ]
  },
  {
    "id": 203,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 1,
    "grade": "grade_11",
    "gradeLabel": "Grade 11 / 1st Year",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Advanced Rhetoric & Composition",
    "topic": "Thesis Statements, Cohesion, Discourse Markers & Synthesis",
    "learningObjective": "Construct authoritative argumentative thesis statements and use formal transitional discourse markers.",
    "title": "Advanced Composition & Synthesis",
    "description": "Hone college-level expository writing, dialectical argumentation, transitions, and academic register.",
    "difficulty": "Hard",
    "xpReward": 150,
    "questions": [
      {
        "id": "q_11_e1_1",
        "question": "What is the primary function of a Thesis Statement in an academic essay?",
        "options": [
          "To provide a dictionary definition of random words",
          "To articulate the central claim or main argumentative stance of the entire paper",
          "To list the citations and bibliography",
          "To entertain the reader with dialogue"
        ],
        "correctIndex": 1,
        "explanation": "A thesis statement encapsulates the core argument and roadmap of the paper.",
        "tags": [
          "inter-english",
          "thesis-statement"
        ]
      },
      {
        "id": "q_11_e1_2",
        "question": "Which transitional phrase signals a concession or counter-argument?",
        "options": [
          "Furthermore",
          "Notwithstanding",
          "Consequently",
          "In addition"
        ],
        "correctIndex": 1,
        "explanation": "'Notwithstanding' functions similarly to 'in spite of' or 'nevertheless', indicating concession.",
        "tags": [
          "inter-english",
          "transitions"
        ]
      },
      {
        "id": "q_11_e1_3",
        "question": "What term denotes the logical flow and smooth connection between sentences and paragraphs?",
        "options": [
          "Syntax",
          "Coherence & Cohesion",
          "Allusion",
          "Onomatopoeia"
        ],
        "correctIndex": 1,
        "explanation": "Coherence refers to conceptual clarity; cohesion refers to the grammatical and lexical linking of sentences.",
        "tags": [
          "inter-english",
          "cohesion"
        ]
      },
      {
        "id": "q_11_e1_4",
        "question": "Choose the sentence that avoids a comma splice:",
        "options": [
          "The experiment failed, we decided to try again.",
          "The experiment failed; however, we decided to try again.",
          "The experiment failed, however we decided to try again.",
          "The experiment failed, so then we decided to try again."
        ],
        "correctIndex": 1,
        "explanation": "Two independent clauses linked by a conjunctive adverb ('however') require a semicolon before and a comma after.",
        "tags": [
          "inter-english",
          "comma-splice"
        ]
      },
      {
        "id": "q_11_e1_5",
        "question": "Which rhetorical appeal relies upon ethical credibility, expertise, and moral authority?",
        "options": [
          "Pathos",
          "Ethos",
          "Logos",
          "Kairos"
        ],
        "correctIndex": 1,
        "explanation": "Aristotle's rhetorical triad: Ethos (credibility/ethics), Pathos (emotion), Logos (logic and reason).",
        "tags": [
          "inter-english",
          "rhetoric"
        ]
      }
    ]
  },
  {
    "id": 204,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 1,
    "grade": "grade_11",
    "gradeLabel": "Grade 11 / 1st Year",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Boolean Algebra & Logic Gates",
    "topic": "Logic Gates (AND, OR, NOT, NAND, NOR, XOR) & Truth Tables",
    "learningObjective": "Evaluate Boolean expressions, synthesize truth tables, and recognize universal logic gates (NAND/NOR).",
    "title": "Boolean Algebra & Digital Circuits",
    "description": "Design combinatorial digital logic circuits: truth table analysis, De Morgan's Laws, and universal logic gates.",
    "difficulty": "Hard",
    "xpReward": 150,
    "questions": [
      {
        "id": "q_11_c1_1",
        "question": "Which logic gate produces an output of 1 only when BOTH inputs are 1?",
        "options": [
          "OR gate",
          "AND gate",
          "XOR gate",
          "NOR gate"
        ],
        "correctIndex": 1,
        "explanation": "The AND gate performs logical multiplication: output is 1 only when both inputs A and B are 1.",
        "tags": [
          "inter-cs",
          "logic-gates",
          "and-gate"
        ]
      },
      {
        "id": "q_11_c1_2",
        "question": "Why are NAND and NOR gates designated as 'Universal Gates'?",
        "options": [
          "They can be used anywhere in the universe",
          "Any other Boolean logic gate (AND, OR, NOT) can be constructed using NAND or NOR gates alone",
          "They never overheat",
          "They have zero electrical resistance"
        ],
        "correctIndex": 1,
        "explanation": "Universal gates can implement all three basic operations (conjunction, disjunction, negation) without any other gate types.",
        "tags": [
          "inter-cs",
          "universal-gates"
        ]
      },
      {
        "id": "q_11_c1_3",
        "question": "What is De Morgan's First Theorem for Boolean Algebra?",
        "options": [
          "(A + B)' = A' · B'",
          "(A · B)' = A' · B'",
          "(A + B)' = A + B",
          "(A')' = 0"
        ],
        "correctIndex": 0,
        "explanation": "De Morgan's Theorem: the complement of a sum equals the product of the individual complements: (A + B)' = A' · B'.",
        "tags": [
          "inter-cs",
          "de-morgans-laws"
        ]
      },
      {
        "id": "q_11_c1_4",
        "question": "An XOR (Exclusive OR) gate with inputs A=1 and B=1 produces an output of:",
        "options": [
          "1",
          "0",
          "Undefined",
          "2"
        ],
        "correctIndex": 1,
        "explanation": "XOR outputs 1 if and only if the inputs are different. When both inputs are identical (1 and 1 or 0 and 0), XOR outputs 0.",
        "tags": [
          "inter-cs",
          "xor-gate"
        ]
      },
      {
        "id": "q_11_c1_5",
        "question": "How many rows are required in a complete truth table for a logic circuit with 4 input variables?",
        "options": [
          "8",
          "12",
          "16",
          "32"
        ],
        "correctIndex": 2,
        "explanation": "Number of combinations for n binary variables = 2^n = 2⁴ = 16 rows.",
        "tags": [
          "inter-cs",
          "truth-tables"
        ]
      }
    ]
  },
  {
    "id": 301,
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "subjectStageNumber": 1,
    "grade": "grade_12",
    "gradeLabel": "Grade 12 / 2nd Year",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Calculus: Limits & Derivatives",
    "topic": "Limits of Functions, First Principles & Power Rule d/dx(x^n)",
    "learningObjective": "Evaluate limits, compute derivatives using the power rule, and find slopes of tangent lines.",
    "title": "Calculus: Limits & Derivatives",
    "description": "Unravel the calculus of change: instantaneous rates of change, tangent slopes, and differential rules.",
    "difficulty": "Hard",
    "xpReward": 160,
    "questions": [
      {
        "id": "q_12_m1_1",
        "question": "What is the derivative with respect to x of f(x) = x⁴ using the Power Rule?",
        "options": [
          "4x³",
          "3x⁴",
          "x³ / 4",
          "4x⁵"
        ],
        "correctIndex": 0,
        "explanation": "The power rule states d/dx(x^n) = n * x^(n-1). For x⁴: 4x^(4-1) = 4x³.",
        "tags": [
          "inter2-math",
          "calculus",
          "power-rule"
        ]
      },
      {
        "id": "q_12_m1_2",
        "question": "Evaluate the limit: lim(x→2) [ (x² - 4) / (x - 2) ].",
        "options": [
          "0",
          "2",
          "4",
          "Undefined"
        ],
        "correctIndex": 2,
        "explanation": "Factor numerator: (x - 2)(x + 2) / (x - 2) = x + 2. Evaluating at x = 2 gives 2 + 2 = 4.",
        "tags": [
          "inter2-math",
          "limits"
        ]
      },
      {
        "id": "q_12_m1_3",
        "question": "What is the derivative of the sine function: d/dx[sin(x)]?",
        "options": [
          "-cos(x)",
          "cos(x)",
          "tan(x)",
          "-sin(x)"
        ],
        "correctIndex": 1,
        "explanation": "d/dx[sin(x)] = cos(x).",
        "tags": [
          "inter2-math",
          "trig-derivatives"
        ]
      },
      {
        "id": "q_12_m1_4",
        "question": "Geometrically, what does the first derivative f'(a) represent on the graph of y = f(x)?",
        "options": [
          "Area under the curve",
          "Slope of the tangent line at x = a",
          "Length of the curve",
          "Y-intercept"
        ],
        "correctIndex": 1,
        "explanation": "The derivative f'(a) is the instantaneous slope (gradient) of the tangent line to the curve at point x = a.",
        "tags": [
          "inter2-math",
          "geometric-meaning"
        ]
      },
      {
        "id": "q_12_m1_5",
        "question": "What is the derivative of any constant number c (d/dx[c])?",
        "options": [
          "0",
          "1",
          "c",
          "x"
        ],
        "correctIndex": 0,
        "explanation": "A constant does not change, so its instantaneous rate of change is identically zero.",
        "tags": [
          "inter2-math",
          "constants-derivative"
        ]
      }
    ]
  },
  {
    "id": 302,
    "subject": "science",
    "subjectName": "Science",
    "subjectStageNumber": 1,
    "grade": "grade_12",
    "gradeLabel": "Grade 12 / 2nd Year",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Electromagnetism",
    "topic": "Magnetic Flux, Faraday's Law & Lenz's Law",
    "learningObjective": "State Faraday's law of induction and explain Lenz's law regarding induced EMF polarity.",
    "title": "Electromagnetism & Induction",
    "description": "Examine electromagnetic induction: magnetic flux, changing magnetic fields generating currents, and transformers.",
    "difficulty": "Hard",
    "xpReward": 160,
    "questions": [
      {
        "id": "q_12_s1_1",
        "question": "According to Faraday's Law, the induced electromotive force (EMF) in a circuit is directly proportional to:",
        "options": [
          "The static magnetic field strength",
          "The time rate of change of magnetic flux through the circuit",
          "The temperature of the wire",
          "The length of the battery"
        ],
        "correctIndex": 1,
        "explanation": "Faraday's Law states: EMF ε = -N (dΦ / dt). Induced EMF is proportional to rate of change of magnetic flux.",
        "tags": [
          "inter2-physics",
          "faradays-law"
        ]
      },
      {
        "id": "q_12_s1_2",
        "question": "What does Lenz's Law specify about the direction of an induced current?",
        "options": [
          "It always flows clockwise",
          "It flows in such a direction as to oppose the change in magnetic flux that causes it",
          "It flows in the same direction as the external magnet",
          "It generates infinite energy"
        ],
        "correctIndex": 1,
        "explanation": "Lenz's Law ensures conservation of energy: the magnetic field of the induced current opposes the original flux change.",
        "tags": [
          "inter2-physics",
          "lenzs-law"
        ]
      },
      {
        "id": "q_12_s1_3",
        "question": "What is the SI unit of magnetic flux (Φ)?",
        "options": [
          "Tesla (T)",
          "Weber (Wb)",
          "Henry (H)",
          "Farad (F)"
        ],
        "correctIndex": 1,
        "explanation": "Magnetic flux Φ = B · A is measured in Webers (1 Wb = 1 Tesla · m²).",
        "tags": [
          "inter2-physics",
          "units",
          "flux"
        ]
      },
      {
        "id": "q_12_s1_4",
        "question": "Which electrical device uses mutual induction to step up or step down alternating voltage?",
        "options": [
          "Capacitor",
          "Transformer",
          "Resistor",
          "Diode"
        ],
        "correctIndex": 1,
        "explanation": "Transformers operate on mutual induction between primary and secondary coils wound on an iron core.",
        "tags": [
          "inter2-physics",
          "transformers"
        ]
      },
      {
        "id": "q_12_s1_5",
        "question": "What magnetic force acts on a charge q moving with velocity v perpendicular to magnetic field B?",
        "options": [
          "F = q / (v * B)",
          "F = q * v * B",
          "F = 0",
          "F = v * B / q"
        ],
        "correctIndex": 1,
        "explanation": "Lorentz magnetic force is F = q(v × B). When v and B are perpendicular (θ = 90°), F = q * v * B.",
        "tags": [
          "inter2-physics",
          "lorentz-force"
        ]
      }
    ]
  },
  {
    "id": 303,
    "subject": "english",
    "subjectName": "English",
    "subjectStageNumber": 1,
    "grade": "grade_12",
    "gradeLabel": "Grade 12 / 2nd Year",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Literary Criticism & Stylistics",
    "topic": "Allegory, Dramatic Irony, Motif & Deconstructive Analysis",
    "learningObjective": "Distinguish allegorical texts, identify dramatic irony, and critique motifs in major literature.",
    "title": "Literary Stylistics & Analysis",
    "description": "Probe complex narrative architectures: allegorical symbolism, dramatic irony, recurring motifs, and stream of consciousness.",
    "difficulty": "Hard",
    "xpReward": 160,
    "questions": [
      {
        "id": "q_12_e1_1",
        "question": "What defines an 'Allegory' in literature?",
        "options": [
          "A short poem of 14 lines",
          "A complete narrative where characters and events symbolize deeper political, moral, or philosophical meanings",
          "A play that ends in tragedy",
          "A dictionary entry"
        ],
        "correctIndex": 1,
        "explanation": "An allegory (e.g. Orwell's Animal Farm) has both a literal surface story and a coherent symbolic second meaning.",
        "tags": [
          "inter2-english",
          "allegory"
        ]
      },
      {
        "id": "q_12_e1_2",
        "question": "What situation constitutes 'Dramatic Irony'?",
        "options": [
          "When the audience or reader knows crucial facts that the characters in the story do not know",
          "When words mean the exact opposite of what is spoken",
          "When the weather matches the character's mood",
          "When a character tells a joke"
        ],
        "correctIndex": 0,
        "explanation": "Dramatic irony arises when the audience possesses superior foreknowledge of upcoming tragedy or truth that characters are oblivious to.",
        "tags": [
          "inter2-english",
          "dramatic-irony"
        ]
      },
      {
        "id": "q_12_e1_3",
        "question": "What is a 'Motif' in a novel or play?",
        "options": [
          "The main villain's name",
          "A recurring symbolic element, image, or idea that reinforces the central theme",
          "The font used by the printer",
          "The author's autograph"
        ],
        "correctIndex": 1,
        "explanation": "A motif is an intentional repeating pattern (e.g., green light in Gatsby, blood in Macbeth) reinforcing broader themes.",
        "tags": [
          "inter2-english",
          "motifs"
        ]
      },
      {
        "id": "q_12_e1_4",
        "question": "What is an 'Oxymoron'?",
        "options": [
          "A comparison using 'like' or 'as'",
          "A figure of speech pairing contradictory terms side-by-side (e.g. 'deafening silence')",
          "A long speech by an actor alone on stage",
          "Repetition of vowel sounds"
        ],
        "correctIndex": 1,
        "explanation": "An oxymoron fuses two contradictory concepts together for striking paradoxical impact.",
        "tags": [
          "inter2-english",
          "oxymoron"
        ]
      },
      {
        "id": "q_12_e1_5",
        "question": "Which narrative style portrays the uninterrupted, chaotic flow of a character's interior thoughts and perceptions?",
        "options": [
          "Epistolary narrative",
          "Stream of Consciousness",
          "Third person objective",
          "Picaresque"
        ],
        "correctIndex": 1,
        "explanation": "Stream of consciousness mimics the nonlinear flow of conscious human thought (seen in Virginia Woolf, James Joyce).",
        "tags": [
          "inter2-english",
          "stream-of-consciousness"
        ]
      }
    ]
  },
  {
    "id": 304,
    "subject": "computer_science",
    "subjectName": "Computer Science",
    "subjectStageNumber": 1,
    "grade": "grade_12",
    "gradeLabel": "Grade 12 / 2nd Year",
    "level": 1,
    "levelName": "Foundations",
    "chapter": "Database Management Systems (DBMS) & SQL",
    "topic": "Relational Models, Primary Keys, Foreign Keys & Basic Queries",
    "learningObjective": "Model entity relationships, understand primary/foreign keys, and formulate basic SQL SELECT statements.",
    "title": "Relational Databases & SQL Queries",
    "description": "Structure relational data: relational schemas, primary key constraints, foreign key referential integrity, and SQL queries.",
    "difficulty": "Hard",
    "xpReward": 160,
    "questions": [
      {
        "id": "q_12_c1_1",
        "question": "What attribute uniquely identifies each record in a relational database table?",
        "options": [
          "Foreign Key",
          "Primary Key",
          "Composite Index",
          "Data Type"
        ],
        "correctIndex": 1,
        "explanation": "A Primary Key constraint uniquely identifies each row (tuple) in a table and cannot contain NULL values.",
        "tags": [
          "inter2-cs",
          "dbms",
          "primary-key"
        ]
      },
      {
        "id": "q_12_c1_2",
        "question": "What SQL statement is used to retrieve data from a database table?",
        "options": [
          "EXTRACT",
          "SELECT",
          "PULL",
          "FETCH"
        ],
        "correctIndex": 1,
        "explanation": "SELECT is the fundamental SQL data retrieval command: SELECT columns FROM table WHERE condition.",
        "tags": [
          "inter2-cs",
          "sql",
          "select"
        ]
      },
      {
        "id": "q_12_c1_3",
        "question": "What is a Foreign Key in a relational schema?",
        "options": [
          "A key purchased from a foreign software company",
          "A field in one table that references the Primary Key of another table to establish relationships",
          "A password used to encrypt database backups",
          "A field that must always remain empty"
        ],
        "correctIndex": 1,
        "explanation": "A foreign key enforces referential integrity by referencing an existing primary key in a parent table.",
        "tags": [
          "inter2-cs",
          "foreign-key"
        ]
      },
      {
        "id": "q_12_c1_4",
        "question": "Which clause in SQL is used to filter records that satisfy a specific condition?",
        "options": [
          "ORDER BY",
          "GROUP BY",
          "WHERE",
          "LIMIT"
        ],
        "correctIndex": 2,
        "explanation": "The WHERE clause filters results based on boolean predicates (e.g. WHERE score >= 70).",
        "tags": [
          "inter2-cs",
          "sql-where"
        ]
      },
      {
        "id": "q_12_c1_5",
        "question": "What process in database design eliminates data redundancy and prevents update anomalies?",
        "options": [
          "Defragmentation",
          "Normalization (1NF, 2NF, 3NF)",
          "Indexing",
          "Compilation"
        ],
        "correctIndex": 1,
        "explanation": "Normalization organizes table attributes systematically to minimize redundancy and eliminate insert/update/delete anomalies.",
        "tags": [
          "inter2-cs",
          "normalization"
        ]
      }
    ]
  }
];

export const STREAM_DISCOVERY_STAGE: Stage = {
  "id": "stream_festival",
  "title": "STREAM Discovery Arena",
  "description": "Cross-disciplinary festival challenge spanning Science, Technology, Reading, Engineering, Arts, and Mathematics.",
  "xpReward": 300,
  "questions": [
    {
      "id": "q_stream_s",
      "question": "[Science] In the electrolysis of acidified water, what gas collects at the cathode (negative electrode)?",
      "options": [
        "Oxygen gas",
        "Hydrogen gas",
        "Chlorine gas",
        "Nitrogen gas"
      ],
      "correctIndex": 1,
      "explanation": "Positively charged H+ ions migrate to the negative cathode, accepting electrons to produce Hydrogen gas (H₂).",
      "tags": [
        "stream",
        "science",
        "electrolysis"
      ]
    },
    {
      "id": "q_stream_t",
      "question": "[Technology] Which protocol encrypts web browser traffic to provide secure, tamper-proof communications?",
      "options": [
        "FTP",
        "HTTPS (HTTP over TLS/SSL)",
        "SMTP",
        "Telnet"
      ],
      "correctIndex": 1,
      "explanation": "HTTPS encrypts session traffic via TLS (Transport Layer Security), protecting against eavesdropping and man-in-the-middle attacks.",
      "tags": [
        "stream",
        "technology",
        "security"
      ]
    },
    {
      "id": "q_stream_r",
      "question": "[Reading] The emotional atmosphere created by a literary piece through descriptive language and setting is termed:",
      "options": [
        "Plot twist",
        "Mood",
        "Alliteration",
        "Conflict"
      ],
      "correctIndex": 1,
      "explanation": "Mood is the emotional feeling or atmosphere evoked within the reader by the author's stylistic tone and setting.",
      "tags": [
        "stream",
        "reading",
        "literary-devices"
      ]
    },
    {
      "id": "q_stream_e",
      "question": "[Engineering] Why are triangles extensively utilized in bridge trusses and crane booms rather than squares?",
      "options": [
        "Triangles are cheaper to paint",
        "A triangle is inherently rigid and cannot deform without changing side lengths",
        "Triangles are lighter than air",
        "Square corners are illegal in building codes"
      ],
      "correctIndex": 1,
      "explanation": "Triangles distribute forces along their member axes (tension and compression), making triangular trusses structurally rigid under heavy loads.",
      "tags": [
        "stream",
        "engineering",
        "structures"
      ]
    },
    {
      "id": "q_stream_a",
      "question": "[Arts] In graphic and fine arts, colors positioned directly opposite one another on the color wheel are known as:",
      "options": [
        "Monochromatic colors",
        "Complementary colors",
        "Analogous colors",
        "Tertiary colors"
      ],
      "correctIndex": 1,
      "explanation": "Complementary colors (e.g. blue and orange, red and green) sit directly opposite on the color wheel, creating maximum visual contrast.",
      "tags": [
        "stream",
        "arts",
        "color-theory"
      ]
    },
    {
      "id": "q_stream_m",
      "question": "[Mathematics] What is the mathematical Golden Ratio (approx. 1.618) frequently denoted by in art and architecture?",
      "options": [
        "Pi (π)",
        "Phi (φ)",
        "Sigma (Σ)",
        "Theta (θ)"
      ],
      "correctIndex": 1,
      "explanation": "The Golden Ratio is represented by Greek letter Phi (φ = (1 + √5)/2 ≈ 1.618033...), widely admired for aesthetic geometric proportions.",
      "tags": [
        "stream",
        "mathematics",
        "golden-ratio"
      ]
    }
  ]
};

export const DAILY_QUESTION_POOL: Question[] = [
  {
    "id": "q_daily_1",
    "question": "If a circle has a radius of 7 cm, what is its circumference? (Use π ≈ 22/7)",
    "options": [
      "22 cm",
      "44 cm",
      "154 cm",
      "88 cm"
    ],
    "correctIndex": 1,
    "explanation": "Circumference C = 2 * π * r = 2 * (22/7) * 7 = 44 cm.",
    "tags": [
      "daily",
      "math",
      "geometry"
    ]
  },
  {
    "id": "q_daily_2",
    "question": "What is the powerhouse organelle of the biological cell?",
    "options": [
      "Ribosome",
      "Nucleus",
      "Mitochondria",
      "Lysosome"
    ],
    "correctIndex": 2,
    "explanation": "Mitochondria synthesize cellular ATP through aerobic cellular respiration.",
    "tags": [
      "daily",
      "science",
      "biology"
    ]
  },
  {
    "id": "q_daily_3",
    "question": "Choose the word with the correct spelling:",
    "options": [
      "Accomodate",
      "Accommodate",
      "Acommodate",
      "Acomodate"
    ],
    "correctIndex": 1,
    "explanation": "Accommodate features double 'c' and double 'm'.",
    "tags": [
      "daily",
      "english",
      "spelling"
    ]
  },
  {
    "id": "q_daily_4",
    "question": "Which of the following is equivalent to 1 Kilobyte (KB) in binary bytes?",
    "options": [
      "1000 Bytes",
      "1024 Bytes",
      "512 Bytes",
      "2048 Bytes"
    ],
    "correctIndex": 1,
    "explanation": "In computing binary units, 1 KiB / 1 KB = 2¹⁰ = 1024 Bytes.",
    "tags": [
      "daily",
      "cs",
      "units"
    ]
  },
  {
    "id": "q_daily_5",
    "question": "What is the chemical formula for ordinary table salt?",
    "options": [
      "HCl",
      "NaOH",
      "NaCl",
      "CaCO₃"
    ],
    "correctIndex": 2,
    "explanation": "Sodium chloride (NaCl) is the chemical compound known as table salt.",
    "tags": [
      "daily",
      "science",
      "chemistry"
    ]
  }
];
