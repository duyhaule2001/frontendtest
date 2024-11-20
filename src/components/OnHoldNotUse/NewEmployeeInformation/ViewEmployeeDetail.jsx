import { Descriptions, Divider, Drawer, Image, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ViewEmployeeDetail = ({ openModalViewDetail, setOpenModalViewDetail, selectedEmployee }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState({
        residenceCardList: [],
        employmentInsuranceList: [],
        healthInsuranceList: [],
    });

    useEffect(() => {
        if (selectedEmployee) {
            const generateFileList = (images, label) => {
                if (!Array.isArray(images)) {
                    images = [images];
                }
                return images.map((item, index) => ({
                    uid: uuidv4(),
                    name: `${label} ${index + 1}`,
                    status: 'done',
                    url: item,
                }));
            };

            setFileList({
                residenceCardList: generateFileList(selectedEmployee?.ResidenceCard || [], 'Residence Card'),
                employmentInsuranceList: generateFileList(
                    selectedEmployee?.EmploymentInsurance || [],
                    'Employment Insurance',
                ),
                healthInsuranceList: generateFileList(selectedEmployee?.HealthInsurance || [], 'Health Insurance'),
            });
        }
    }, [selectedEmployee]);

    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    return (
        <div>
            <Drawer
                width={'50%'}
                title="社員情報確認"
                onClose={() => setOpenModalViewDetail(false)}
                open={openModalViewDetail}
            >
                {selectedEmployee && (
                    <>
                        <Descriptions title="詳細情報" bordered column={2}>
                            <Descriptions.Item label="氏名">{selectedEmployee?.Name}</Descriptions.Item>
                            <Descriptions.Item label="フリガナ">{selectedEmployee?.Furigana}</Descriptions.Item>
                            <Descriptions.Item label="社員NO.">{selectedEmployee?.EmployeeNo}</Descriptions.Item>
                            <Descriptions.Item label="契約形態">{selectedEmployee?.ContractType}</Descriptions.Item>
                            <Descriptions.Item label="所属">{selectedEmployee?.Department}</Descriptions.Item>
                            <Descriptions.Item label="性別">{selectedEmployee?.Gender}</Descriptions.Item>
                            <Descriptions.Item label="生年月日">{selectedEmployee?.DateOfBirth}</Descriptions.Item>
                            <Descriptions.Item label="年齢">{selectedEmployee?.Age}</Descriptions.Item>
                            <Descriptions.Item label="既婚/未婚">{selectedEmployee?.MaritalStatus}</Descriptions.Item>
                            <Descriptions.Item label="国籍">{selectedEmployee?.Nationality}</Descriptions.Item>
                            <Descriptions.Item label="在留カード番号">
                                {selectedEmployee?.ResidenceCardNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="在留期間">{selectedEmployee?.ResidencePeriod}</Descriptions.Item>
                            <Descriptions.Item label="連絡先">{selectedEmployee?.Contact}</Descriptions.Item>
                            <Descriptions.Item label="入社日">{selectedEmployee?.DateOfJoining}</Descriptions.Item>
                            <Descriptions.Item label="社歴">{selectedEmployee?.CompanyHistory}</Descriptions.Item>
                            <Descriptions.Item label="終了時間">{selectedEmployee?.EndTime}</Descriptions.Item>
                            <Descriptions.Item label="在籍/退職">
                                {selectedEmployee?.EmploymentStatus}
                            </Descriptions.Item>
                            <Descriptions.Item label="所属部門">
                                {selectedEmployee?.DepartmentAffiliation}
                            </Descriptions.Item>
                            <Descriptions.Item label="在日緊急連絡人">
                                {selectedEmployee?.EmergencyContactInJapan}
                            </Descriptions.Item>
                            <Descriptions.Item label="在日緊急連絡先">
                                {selectedEmployee?.EmergencyContactInJapanPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="国内緊急連絡人">
                                {selectedEmployee?.EmergencyContactInHomeCountry}
                            </Descriptions.Item>
                            <Descriptions.Item label="国内緊急連絡先">
                                {selectedEmployee?.EmergencyContactInHomeCountryPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="備考">{selectedEmployee?.Notes}</Descriptions.Item>
                            <Descriptions.Item label="年金">{selectedEmployee?.Pension}</Descriptions.Item>
                            <Descriptions.Item label="個人番号">{selectedEmployee?.PersonalNumber}</Descriptions.Item>
                        </Descriptions>

                        <Divider>在留カード</Divider>
                        <Upload
                            listType="picture-card"
                            fileList={fileList.residenceCardList}
                            onPreview={handlePreview}
                            showUploadList={{ showRemoveIcon: false }}
                        />

                        <Divider>雇用保険</Divider>
                        <Upload
                            listType="picture-card"
                            fileList={fileList.employmentInsuranceList}
                            onPreview={handlePreview}
                            showUploadList={{ showRemoveIcon: false }}
                        />

                        <Divider>健康保険</Divider>
                        <Upload
                            listType="picture-card"
                            fileList={fileList.healthInsuranceList}
                            onPreview={handlePreview}
                            showUploadList={{ showRemoveIcon: false }}
                        />

                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                }}
                                src={previewImage}
                            />
                        )}
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default ViewEmployeeDetail;
