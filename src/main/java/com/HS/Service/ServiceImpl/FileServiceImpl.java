package com.HS.Service.ServiceImpl;

import com.HS.Service.Service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @Override
    public String upload(MultipartFile file) {
        try {

            // ✅ check file
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            // ✅ unique file name
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // ✅ create folder if not exists
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // ✅ save file
            File destination = new File(dir, fileName);
            file.transferTo(destination);

            // ✅ return URL
            return "/uploads/" + fileName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }
}