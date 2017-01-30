export default [
    { terminate: true, cycles:  5, test: 0b000000000000, mask: 0b111100000000, op: "JP", args: ["{I}"] },
    { terminate: true, cycles:  5, test: 0b111111101000, mask: 0b111111111111, op: "JPBA", args: [] },
    { terminate: false, cycles:  5, test: 0b001000000000, mask: 0b111100000000, op: "JP", condition: "C", args: ["{I}"] },
    { terminate: false, cycles:  5, test: 0b001100000000, mask: 0b111100000000, op: "JP", condition: "NC", args: ["{I}"] },
    { terminate: false, cycles:  5, test: 0b011000000000, mask: 0b111100000000, op: "JP", condition: "Z", args: ["{I}"] },
    { terminate: false, cycles:  5, test: 0b011100000000, mask: 0b111100000000, op: "JP", condition: "NZ", args: ["{I}"] },

    { terminate: true, cycles:  7, test: 0b010000000000, mask: 0b111100000000, op: "CALL", args: ["{I}"] },
    { terminate: true, cycles:  7, test: 0b010100000000, mask: 0b111100000000, op: "CALZ", args: ["{I}"] },
    { terminate: true, cycles:  7, test: 0b111111011111, mask: 0b111111111111, op: "RET", args: [] },
    { terminate: true, cycles: 12, test: 0b111111011110, mask: 0b111111111111, op: "RETS", args: [] },
    { terminate: true, cycles: 12, test: 0b000100000000, mask: 0b111100000000, op: "RETD", args: ["{I}"] },

    { terminate: false, cycles:  5, test: 0b100000000000, mask: 0b111100000000, op: "LD", args: ["YB", "{I}"] },
    { terminate: false, cycles:  5, test: 0b101100000000, mask: 0b111100000000, op: "LD", args: ["XB", "{I}"] },
    { terminate: false, cycles:  5, test: 0b111000000000, mask: 0b111111000000, op: "LD", args: ["{Z}", "{I4}"] },
    { terminate: false, cycles:  5, test: 0b111010000000, mask: 0b111111111100, op: "LD", args: ["XP", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111010000100, mask: 0b111111111100, op: "LD", args: ["XH", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111010001000, mask: 0b111111111100, op: "LD", args: ["XL", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111010010000, mask: 0b111111111100, op: "LD", args: ["YP", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111010010100, mask: 0b111111111100, op: "LD", args: ["YH", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111010011000, mask: 0b111111111100, op: "LD", args: ["YL", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111010100000, mask: 0b111111111100, op: "LD", args: ["{X}", "XP"] },
    { terminate: false, cycles:  5, test: 0b111010100100, mask: 0b111111111100, op: "LD", args: ["{X}", "XH"] },
    { terminate: false, cycles:  5, test: 0b111010101000, mask: 0b111111111100, op: "LD", args: ["{X}", "XL"] },
    { terminate: false, cycles:  5, test: 0b111010110000, mask: 0b111111111100, op: "LD", args: ["{X}", "YP"] },
    { terminate: false, cycles:  5, test: 0b111010110100, mask: 0b111111111100, op: "LD", args: ["{X}", "YH"] },
    { terminate: false, cycles:  5, test: 0b111010111000, mask: 0b111111111100, op: "LD", args: ["{X}", "YL"] },
    { terminate: false, cycles:  5, test: 0b111011000000, mask: 0b111111110000, op: "LD", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111110000000, mask: 0b111111110000, op: "LD", args: ["M{I}", "A"] },
    { terminate: false, cycles:  5, test: 0b111110010000, mask: 0b111111110000, op: "LD", args: ["M{I}", "B"] },
    { terminate: false, cycles:  5, test: 0b111110100000, mask: 0b111111110000, op: "LD", args: ["A", "M{I}"] },
    { terminate: false, cycles:  5, test: 0b111110110000, mask: 0b111111110000, op: "LD", args: ["B", "M{I}"] },
    { terminate: false, cycles:  5, test: 0b111111100000, mask: 0b111111111100, op: "LD", args: ["SPH", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111111100100, mask: 0b111111111100, op: "LD", args: ["{X}", "SPH"] },
    { terminate: false, cycles:  5, test: 0b111111110000, mask: 0b111111111100, op: "LD", args: ["SPL", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111111110100, mask: 0b111111111100, op: "LD", args: ["{X}", "SPL"] },

    { terminate: false, cycles:  5, test: 0b111001100000, mask: 0b111111110000, op: "LDPX", args: ["MX", "{I}"] },
    { terminate: false, cycles:  5, test: 0b111011100000, mask: 0b111111110000, op: "LDPX", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  5, test: 0b111001110000, mask: 0b111111110000, op: "LDPY", args: ["MY", "{I}"] },
    { terminate: false, cycles:  5, test: 0b111011110000, mask: 0b111111110000, op: "LDPY", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  5, test: 0b100100000000, mask: 0b111100000000, op: "LBPX", args: ["{I}"] },

    { terminate: false, cycles:  5, test: 0b111111000000, mask: 0b111111111100, op: "PUSH", args: ["{X}"] },
    { terminate: false, cycles:  5, test: 0b111111000100, mask: 0b111111111111, op: "PUSH", args: ["XP"] },
    { terminate: false, cycles:  5, test: 0b111111000101, mask: 0b111111111111, op: "PUSH", args: ["XH"] },
    { terminate: false, cycles:  5, test: 0b111111000110, mask: 0b111111111111, op: "PUSH", args: ["XL"] },
    { terminate: false, cycles:  5, test: 0b111111000111, mask: 0b111111111111, op: "PUSH", args: ["YP"] },
    { terminate: false, cycles:  5, test: 0b111111001000, mask: 0b111111111111, op: "PUSH", args: ["YH"] },
    { terminate: false, cycles:  5, test: 0b111111001001, mask: 0b111111111111, op: "PUSH", args: ["YL"] },
    { terminate: false, cycles:  5, test: 0b111111001010, mask: 0b111111111111, op: "PUSH", args: ["F"] },
    { terminate: false, cycles:  5, test: 0b111111010000, mask: 0b111111111100, op: "POP", args: ["{X}"] },
    { terminate: false, cycles:  5, test: 0b111111010100, mask: 0b111111111111, op: "POP", args: ["XP"] },
    { terminate: false, cycles:  5, test: 0b111111010101, mask: 0b111111111111, op: "POP", args: ["XH"] },
    { terminate: false, cycles:  5, test: 0b111111010110, mask: 0b111111111111, op: "POP", args: ["XL"] },
    { terminate: false, cycles:  5, test: 0b111111010111, mask: 0b111111111111, op: "POP", args: ["YP"] },
    { terminate: false, cycles:  5, test: 0b111111011000, mask: 0b111111111111, op: "POP", args: ["YH"] },
    { terminate: false, cycles:  5, test: 0b111111011001, mask: 0b111111111111, op: "POP", args: ["YL"] },
    { terminate: false, cycles:  5, test: 0b111111011010, mask: 0b111111111111, op: "POP", args: ["F"] },

    { terminate: false, cycles:  5, test: 0b111111011011, mask: 0b111111111111, op: "INC_S", args: ["SP"] },
    { terminate: false, cycles:  5, test: 0b111111001011, mask: 0b111111111111, op: "DEC_S", args: ["SP"] },
    { terminate: false, cycles:  7, test: 0b111101100000, mask: 0b111111110000, op: "INC", args: ["M{I}"] },
    { terminate: false, cycles:  7, test: 0b111101110000, mask: 0b111111110000, op: "DEC", args: ["M{I}"] },

    { terminate: false, cycles:  7, test: 0b101010000000, mask: 0b111111110000, op: "ADD", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  7, test: 0b110000000000, mask: 0b111111000000, op: "ADD", args: ["{Z}", "{I4}"] },
    { terminate: false, cycles:  7, test: 0b110001000000, mask: 0b111111000000, op: "ADC", args: ["{Z}", "{I4}"] },
    { terminate: false, cycles:  7, test: 0b101010010000, mask: 0b111111110000, op: "ADC", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  7, test: 0b101000000000, mask: 0b111111110000, op: "ADC_D", args: ["XH", "{I}"] },
    { terminate: false, cycles:  7, test: 0b101000010000, mask: 0b111111110000, op: "ADC_D", args: ["XL", "{I}"] },
    { terminate: false, cycles:  7, test: 0b101000100000, mask: 0b111111110000, op: "ADC_D", args: ["YH", "{I}"] },
    { terminate: false, cycles:  7, test: 0b101000110000, mask: 0b111111110000, op: "ADC_D", args: ["YL", "{I}"] },
    { terminate: false, cycles:  7, test: 0b101011110000, mask: 0b111111110000, op: "ADC_D", args: ["{Y}", "{X}"] },

    { terminate: false, cycles:  7, test: 0b101010100000, mask: 0b111111110000, op: "SUB", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  7, test: 0b101010110000, mask: 0b111111110000, op: "SBC", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  7, test: 0b110101000000, mask: 0b111111000000, op: "SBC", args: ["{Z}", "{I4}"] },

    { terminate: false, cycles:  7, test: 0b101001000000, mask: 0b111111110000, op: "CP", args: ["XH", "{I}"] },
    { terminate: false, cycles:  7, test: 0b101001010000, mask: 0b111111110000, op: "CP", args: ["XL", "{I}"] },
    { terminate: false, cycles:  7, test: 0b101001100000, mask: 0b111111110000, op: "CP", args: ["YH", "{I}"] },
    { terminate: false, cycles:  7, test: 0b101001110000, mask: 0b111111110000, op: "CP", args: ["YL", "{I}"] },
    { terminate: false, cycles:  7, test: 0b111100000000, mask: 0b111111110000, op: "CP", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  7, test: 0b110111000000, mask: 0b111111000000, op: "CP", args: ["{Z}", "{I4}"] },

    { terminate: false, cycles:  7, test: 0b101011000000, mask: 0b111111110000, op: "AND", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  7, test: 0b110010000000, mask: 0b111111000000, op: "AND", args: ["{Z}", "{I4}"] },
    { terminate: false, cycles:  7, test: 0b111101010000, mask: 0b111111110000, op: "AND", args: ["F", "{I}"] },
    { terminate: false, cycles:  7, test: 0b101011010000, mask: 0b111111110000, op: "OR", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  7, test: 0b111101000000, mask: 0b111111110000, op: "OR", args: ["F", "{I}"] },
    { terminate: false, cycles:  7, test: 0b110011000000, mask: 0b111111000000, op: "OR", args: ["{Z}", "{I4}"] },
    { terminate: false, cycles:  7, test: 0b101011100000, mask: 0b111111110000, op: "XOR", args: ["{Y}", "{X}"] },
    { terminate: false, cycles:  7, test: 0b110100000000, mask: 0b111111000000, op: "XOR", args: ["{Z}", "{I4}"] },
    { terminate: false, cycles:  5, test: 0b111010001100, mask: 0b111111111100, op: "RRC", args: ["{X}"] },
    { terminate: false, cycles:  7, test: 0b110110000000, mask: 0b111111000000, op: "FAN", args: ["{Z}", "{I4}"] },
    { terminate: false, cycles:  7, test: 0b111100010000, mask: 0b111111110000, op: "FAN", args: ["{Y}", "{X}"] },    

    { terminate: false, cycles:  7, test: 0b111100101000, mask: 0b111111111100, op: "ACPX", args: ["{X}"] },
    { terminate: false, cycles:  7, test: 0b111100101100, mask: 0b111111111100, op: "ACPY", args: ["{X}"] },
    { terminate: false, cycles:  7, test: 0b111100111000, mask: 0b111111111100, op: "SCPX", args: ["{X}"] },
    { terminate: false, cycles:  7, test: 0b111100111100, mask: 0b111111111100, op: "SCPY", args: ["{X}"] },

    { terminate: false, cycles:  5, test: 0b111001000000, mask: 0b111111100000, op: "PSET", args: ["{I}"] },
    { terminate: false, cycles:  5, test: 0b111111111000, mask: 0b111111111111, op: "HALT", args: [] },
    { terminate: false, cycles:  5, test: 0b111111111001, mask: 0b111111111111, op: "SLP", args: [] },
    { terminate: false, cycles:  5, test: 0b111111111011, mask: 0b111111111111, op: "NOP", args: [] },
    { terminate: false, cycles:  7, test: 0b111111111111, mask: 0b111111111111, op: "NOP", args: [] }
];
