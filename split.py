import os
import shutil
import random

# Path to your current dataset folder
dataset_path = r"E:\KCE\SIH\VoiceOfCity\Voice_of_City\Dataset"
output_path = r"E:\KCE\SIH\VoiceOfCity\Voice_of_City\Dataset_split"
val_ratio = 0.2  # 20% for validation

os.makedirs(output_path, exist_ok=True)
os.makedirs(os.path.join(output_path, "train"), exist_ok=True)
os.makedirs(os.path.join(output_path, "val"), exist_ok=True)

classes = os.listdir(dataset_path)  # ['Garbage','Pothole','Sewage','WaterLeakage']

for cls in classes:
    cls_path = os.path.join(dataset_path, cls)
    images = os.listdir(cls_path)
    random.shuffle(images)
    split_idx = int(len(images) * val_ratio)

    train_images = images[split_idx:]
    val_images = images[:split_idx]

    # Create folders
    os.makedirs(os.path.join(output_path, "train", cls), exist_ok=True)
    os.makedirs(os.path.join(output_path, "val", cls), exist_ok=True)

    # Copy images to train
    for img in train_images:
        shutil.copy(os.path.join(cls_path, img),
                    os.path.join(output_path, "train", cls, img))
    # Copy images to val
    for img in val_images:
        shutil.copy(os.path.join(cls_path, img),
                    os.path.join(output_path, "val", cls, img))

print("Dataset split completed!")