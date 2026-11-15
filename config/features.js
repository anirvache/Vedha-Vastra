// ON/OFF switches. If an AI tool ever misbehaves, set it to false, save, redeploy.
// The shop and the rest of the admin keep working.

export const FEATURES = {
  photoTool: true,        // AI studio photos
  descriptionTool: true,  // AI description writer
  dailyPhotoLimit: 40,    // max AI photos in any 24 hours (protects your bill)
};
