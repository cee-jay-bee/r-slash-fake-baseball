import { FormSchemaPitch } from "../types/schemas/pitch-schema";

export function calculateDiff(pitch: FormSchemaPitch){
const difference = pitch.swing - pitch.pitch;
return difference < 0 ? 1000 + difference : difference
}

export function calculateDelta(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null ) {
const delta = pitch.pitch - (previousPitch?.pitch ?? 0)
return delta < 0 ? 1000 + delta : delta

}

export function calculateCircleDelta(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null ) {
    let delta = pitch.pitch - (previousPitch?.pitch ?? 0)
    if (delta > 500) {
        delta -= 1000
    } else if (delta < -500) {
        delta += 1000
    }
    
    return delta
    
    }

export function getModel1(pitch: FormSchemaPitch) {
const average = (pitch.pitch + pitch.swing) / 2;
const adjustment = Math.abs(pitch.pitch - pitch.swing) > 500 ? 500 : 0;

return Math.round((average + adjustment) % 1000)
}

export function getModel2(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let diff = calculateDiff(pitch)
let delta = calculateDelta(pitch, previousPitch)

const average = (diff + delta) / 2;
const adjustment = Math.abs(diff - delta) > 500 ? 500 : 0;

return Math.round((average + adjustment) % 1000)
}

export function getModel3(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let model1 = getModel1(pitch)
let model2 = getModel2(pitch, previousPitch)

let adjustment = model1 - model2 > 500 ? 500 : 0

// Apply the formula
return Math.round(((model1 + model2) / 2 + adjustment) % 1000);
}

export function getModel4(pitch: FormSchemaPitch) {
let model1 = getModel1(pitch)

if ((model1 + 500) > 1000) {
    return model1 - 500;
} else {
    return model1 + 500;
}
}

export function getModel5(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let model2 = getModel2(pitch, previousPitch)

if ((model2 + 500) > 1000) {
    return model2 - 500;
} else {
    return model2 + 500;
}
}

export function getModel6(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let model3 = getModel3(pitch, previousPitch)

if ((model3 + 500) > 1000) {
    return model3 - 500;
} else {
    return model3 + 500;
}
}

export function getModel7(pitch: FormSchemaPitch) {
let diff = calculateDiff(pitch)

if (diff > 750 || diff < 250) {
    return getModel4(pitch);
} else {
    return getModel1(pitch);
}
}

export function getModel8(pitch: FormSchemaPitch) {
let diff = calculateDiff(pitch)

if (diff > 750 || diff < 250) {
    return getModel1(pitch);
} else {
    return getModel4(pitch);
}
}

export function getModel9(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let diff = calculateDiff(pitch)

if (diff > 750 || diff < 250) {
    return getModel5(pitch, previousPitch);
} else {
    return getModel2(pitch, previousPitch);
}
}

export function getModel10(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let diff = calculateDiff(pitch)

if (diff > 750 || diff < 250) {
    return getModel2(pitch, previousPitch);
} else {
    return getModel5(pitch, previousPitch);
}
}

export function getModel11(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let diff = calculateDiff(pitch)

if (diff > 750 || diff < 250) {
    return getModel6(pitch, previousPitch);
} else {
    return getModel3(pitch, previousPitch);
}
}

export function getModel12(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let diff = calculateDiff(pitch)

if (diff > 750 || diff < 250) {
    return getModel3(pitch, previousPitch);
} else {
    return getModel6(pitch, previousPitch);
}
}

export function getModel13(pitch: FormSchemaPitch) {
return calculateDiff(pitch)
}

export function getModel14(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
return calculateDelta(pitch, previousPitch)
}

export function getModel15(pitch: FormSchemaPitch) {
let diff = calculateDiff(pitch)

return diff > 500 ? diff - 500 : diff + 500;
}

export function getModel16(pitch: FormSchemaPitch, previousPitch: FormSchemaPitch | null) {
let delta = calculateDelta(pitch, previousPitch)

return delta > 500 ? delta - 500 : delta + 500;
}