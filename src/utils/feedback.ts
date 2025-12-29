import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

let successSound: Audio.Sound | null = null;
let errorSound: Audio.Sound | null = null;

export async function loadSounds() {
  if (!successSound) {
    successSound = new Audio.Sound();
    await successSound.loadAsync(
      require("../../assets/sounds/success.mp3")
    );
  }

  if (!errorSound) {
    errorSound = new Audio.Sound();
    await errorSound.loadAsync(
      require("../../assets/sounds/error.mp3")
    );
  }
}

export async function playSuccessFeedback() {
  await successSound?.replayAsync();
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function playWarningFeedback() {
  await errorSound?.replayAsync();
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export async function playErrorFeedback() {
  await errorSound?.replayAsync();
  Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Error
  );
}
