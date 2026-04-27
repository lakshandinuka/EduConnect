package com.sfs.educonnect.service;

import com.sfs.educonnect.entity.InquiryType;
import com.sfs.educonnect.repository.InquiryTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InquiryTypeService {
    private final InquiryTypeRepository inquiryTypeRepository;

    public List<InquiryType> getAllInquiryTypes() {
        return inquiryTypeRepository.findAll();
    }
}
