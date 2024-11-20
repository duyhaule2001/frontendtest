import { Descriptions, Divider, Drawer } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

const ProgressDetail = ({ openModalDetail, setOpenModalDetail, itemDetail }) => {
    return (
        <div>
            <Drawer title="情報詳細" onClose={() => setOpenModalDetail(false)} open={openModalDetail} width={'50vw'}>
                {itemDetail && (
                    <>
                        <Descriptions
                            bordered
                            column={2}
                            labelStyle={{
                                width: '155px',
                            }}
                        >
                            <Descriptions.Item label="日付">{itemDetail?.register_date || ''}</Descriptions.Item>

                            <Descriptions.Item label="重要度">{itemDetail?.importance || ''}</Descriptions.Item>

                            <Descriptions.Item label="商談名">{itemDetail?.negotiation_name || ''}</Descriptions.Item>

                            <Descriptions.Item label="確度">{itemDetail?.probability || ''}</Descriptions.Item>

                            <Descriptions.Item label="プロジェクト名">
                                {itemDetail?.project_name || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="ソース">{itemDetail?.source || ''}</Descriptions.Item>

                            <Descriptions.Item label="会社名">{itemDetail?.company_name || ''}</Descriptions.Item>

                            <Descriptions.Item label="提案技術者">
                                {itemDetail?.proposed_engineer || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="願客担当部署">
                                {itemDetail?.client_department || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="相談金額">
                                {itemDetail?.negotiation_amount
                                    ? `${itemDetail.negotiation_amount.toLocaleString()} ¥`
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="願客担当営業">
                                {itemDetail?.client_sales_person || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="担当範囲">{itemDetail?.scope_of_work || ''}</Descriptions.Item>

                            <Descriptions.Item label="プロジェクト分類">
                                {itemDetail?.project_category || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="契約期間その他">
                                {itemDetail?.contract_period_other || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="営業担当">{itemDetail?.sales_person || ''}</Descriptions.Item>

                            <Descriptions.Item label="受注見込期間">
                                {itemDetail?.expected_order_period || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="商談状況">
                                {itemDetail?.negotiation_status || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="失注理由">{itemDetail?.lost_reason || ''}</Descriptions.Item>
                        </Descriptions>
                        <Divider className="py-3">BANT</Divider>

                        <Descriptions
                            bordered
                            column={2}
                            labelStyle={{
                                width: '130px',
                            }}
                        >
                            <Descriptions.Item label="予算">{itemDetail?.budget || ''}</Descriptions.Item>

                            <Descriptions.Item label="発注時間">
                                {itemDetail?.order_time ? dayjs(itemDetail.order_time).format('YYYY-MM-DD') : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="予算詳細">
                                {itemDetail?.budget_detail ? `${itemDetail.budget_detail.toLocaleString()} ¥` : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="選定開始時間">
                                {itemDetail?.selection_start_time
                                    ? dayjs(itemDetail.selection_start_time).format('YYYY-MM-DD')
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="立場">{itemDetail?.position || ''}</Descriptions.Item>

                            <Descriptions.Item label="競合">{itemDetail?.competitors || ''}</Descriptions.Item>

                            <Descriptions.Item label="課題">{itemDetail?.issues || ''}</Descriptions.Item>

                            <Descriptions.Item label="課題その他">{itemDetail?.other_issues || ''}</Descriptions.Item>

                            <Descriptions.Item label="その他">{itemDetail?.others || ''}</Descriptions.Item>

                            <Descriptions.Item label="紹介者">{itemDetail?.referrer || ''}</Descriptions.Item>
                        </Descriptions>
                        <Divider className="py-3">受注後情報</Divider>

                        <Descriptions bordered column={2} labelStyle={{ width: '154px' }}>
                            <Descriptions.Item label="受注日">
                                {itemDetail?.order_date ? dayjs(itemDetail.order_date).format('YYYY-MM-DD') : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="入場先名">{itemDetail?.site_name || ''}</Descriptions.Item>

                            <Descriptions.Item label="見積書依頼日">
                                {itemDetail?.quote_request_date
                                    ? dayjs(itemDetail.quote_request_date).format('YYYY-MM-DD')
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="入場日">
                                {itemDetail?.entry_date ? dayjs(itemDetail.entry_date).format('YYYY-MM-DD') : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="契約日">
                                {itemDetail?.contract_date ? dayjs(itemDetail.contract_date).format('YYYY-MM-DD') : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="入場身分証明書（有無）">
                                {itemDetail?.entry_id_card || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="契約期間">{itemDetail?.contract_period || ''}</Descriptions.Item>

                            <Descriptions.Item label="入場セキュリティ教育(有無)">
                                {itemDetail?.entry_security_training || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="技術者番号">{itemDetail?.technician_id || ''}</Descriptions.Item>

                            <Descriptions.Item label="現場メール">{itemDetail?.onsite_email || ''}</Descriptions.Item>

                            <Descriptions.Item label="契約形態">{itemDetail?.contract_type || ''}</Descriptions.Item>

                            <Descriptions.Item label="現場電話番号">
                                {itemDetail?.onsite_phone_number || ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="残業時間">{itemDetail?.overtime_hours || ''}</Descriptions.Item>

                            <Descriptions.Item label="退場予定日">
                                {itemDetail?.exit_scheduled_date
                                    ? dayjs(itemDetail.exit_scheduled_date).format('YYYY-MM-DD')
                                    : ''}
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default ProgressDetail;
