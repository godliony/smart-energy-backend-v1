#!/bin/bash

# ตรวจสอบว่ามีอุปกรณ์ USB ของคุณ (Kingston Technology DataTraveler G4) เสียบเชื่อมหรือไม่
if lsusb | grep -q "Kingston Technology DataTraveler G4"; then
  # ถ้ามีอุปกรณ์ USB เสียบเชื่อม
  sudo cp /home/godliony/backend/Project-db.sqlite /mnt/tmpDrive/backup.bin
  echo "คัดลอกไฟล์ไปยัง /mnt/tmpDrive/ สำเร็จแล้ว"
else
  # ถ้าไม่มีอุปกรณ์ USB เสียบเชื่อม
  echo "ไม่พบอุปกรณ์ USB ที่เสียบเชื่อม"
fi