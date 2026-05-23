package com.HS.Service.ServiceImpl;

import com.HS.Service.Service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    private final String UPLOAD_DIR = "uploads/";

    @Override
    public String upload(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File destination = new File(UPLOAD_DIR + fileName);
            file.transferTo(destination);

            return "/uploads/" + fileName;

        } catch (Exception e) {
            throw new RuntimeException("File upload failed");
        }
    }
}