import { notification } from 'antd';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

/**
 * 営業報告書をExcelファイルにエクスポートするための関数
 * @param {Array} filteredReportList - エクスポートに含めるレポートのリスト
 * @param {String} selectedDate - エクスポートファイルに表示する選択された日付
 */

// 営業ページ
export const exportSalesReportToExcel = async (filteredReportList, selectedDate) => {
    try {
        // ExcelJSからワークブックを作成
        const workbook = new ExcelJS.Workbook();

        // テンプレートからExcelファイルを読み込む
        const response = await fetch('/templates/SaleDailyReport.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);

        // ワークブックから最初のシートを取得
        const worksheet = workbook.getWorksheet(1);

        // 選択された日付(selectedDate)をセルB3に追加
        worksheet.getCell('B3').value = dayjs(selectedDate).format('YYYY-MM-DD');

        // データの準備
        const data = filteredReportList.map((item) => ({
            companyName: item.companyName,
            department: item.department,
            name: item.name,
            conditionDetails: item.conditionDetails,
            urgency: item.urgency,
            telework: item.telework,
            interviewCount: item.interviewCount,
            otherDetails: item.otherDetails,
            internalResponse: item.internalResponse,
            notes: item.notes,
        }));

        // フォーマットを上書きせずに、6行目からデータを入力
        data.forEach((row, index) => {
            const rowIndex = index + 6; // 6行目から開始

            // フォーマットを上書きせずにセルに値を設定
            worksheet.getCell(`A${rowIndex}`).value = row.companyName;
            worksheet.getCell(`B${rowIndex}`).value = row.department;
            worksheet.getCell(`C${rowIndex}`).value = row.name;
            worksheet.getCell(`D${rowIndex}`).value = row.conditionDetails;
            worksheet.getCell(`E${rowIndex}`).value = row.urgency;
            worksheet.getCell(`F${rowIndex}`).value = row.telework;
            worksheet.getCell(`G${rowIndex}`).value = row.interviewCount;
            worksheet.getCell(`H${rowIndex}`).value = row.otherDetails;
            worksheet.getCell(`I${rowIndex}`).value = row.internalResponse;
            worksheet.getCell(`J${rowIndex}`).value = row.notes;
        });

        // 5行目（タイトル）からデータが終了する行までセルに境界線を追加
        const startRow = 5;
        const endRow = data.length + startRow; // データの終了行

        // A列からJ列までの各セルに境界線を追加
        for (let row = startRow; row <= endRow; row++) {
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach((col) => {
                worksheet.getCell(`${col}${row}`).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        }

        // テンプレートのフォーマットを維持して新しいExcelファイルをエクスポート
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `SalesReport_${dayjs(selectedDate).format('YYYY-MM-DD')}.xlsx`);
    } catch (error) {
        console.error('Excelファイルのエクスポート中にエラーが発生しました:', error.message);
    }
};

//BP推薦ページ
export const exportToExcelForRecommendDepartment = async (filteredReportList, selectedDate) => {
    try {
        // ExcelJSからワークブックを作成
        const workbook = new ExcelJS.Workbook();

        // テンプレートからExcelファイルを読み込む
        const response = await fetch('/templates/RecommendDepartmentReportSale.xlsx'); // パブリックフォルダ内のファイルパス
        const arrayBuffer = await response.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);

        // ワークブックから最初のシートを取得
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error('Excelファイル内にワークシートが見つかりません');
        }

        // 選択された日付(selectedDate)をセルB3に追加
        worksheet.getCell('B3').value = dayjs(selectedDate).format('YYYY-MM-DD');

        // データの準備
        const data = filteredReportList.map((item) => ({
            caseNumber: item.caseNumber,
            conditionDetails: item.conditionDetails,
            urgency: item.urgency,
            telework: item.telework,
            interviewCount: item.interviewCount,
            otherDetails: item.otherDetails,
            sales_or_proposal_department: item.sales_or_proposal_department,
        }));

        // フォーマットを上書きせずに、6行目からデータを入力
        data.forEach((row, index) => {
            const rowIndex = index + 6; // データは6行目から開始

            worksheet.getCell(`A${rowIndex}`).value = row.caseNumber;
            worksheet.getCell(`B${rowIndex}`).value = row.conditionDetails;
            worksheet.getCell(`C${rowIndex}`).value = row.urgency;
            worksheet.getCell(`D${rowIndex}`).value = row.telework;
            worksheet.getCell(`E${rowIndex}`).value = row.interviewCount;
            worksheet.getCell(`F${rowIndex}`).value = row.otherDetails;
            worksheet.getCell(`G${rowIndex}`).value = row.sales_or_proposal_department;
        });

        // 5行目（タイトル）からデータが終了する行までセルに境界線を追加
        const startRow = 5;
        const endRow = data.length + startRow; // データが終了する行

        // A列からG列までの各セルに境界線を追加（H列やその他の不要な列を除外）
        for (let row = startRow; row <= endRow; row++) {
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
                worksheet.getCell(`${col}${row}`).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        }

        // テンプレートのフォーマットを維持して新しいExcelファイルをエクスポート
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `SalesReport_${dayjs(selectedDate).format('YYYY-MM-DD')}.xlsx`);
    } catch (error) {
        console.error('Excelファイルのエクスポート中にエラーが発生しました:', error.message);
        notification.error({
            message: 'エラー',
            description: error.message,
        });
    }
};
