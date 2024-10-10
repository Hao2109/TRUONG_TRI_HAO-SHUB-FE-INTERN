import { useState } from "react";
import { Button, Card, Flex, Upload, Typography, ConfigProvider } from "antd";
import { ArrowLeftOutlined, InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import _ from "lodash";

import ExcelTable from "./ExcelTable";

const { Dragger } = Upload;

interface IRow {
  [key: string]: any;
}
const TaskOnePage = () => {
  const [excelFile, setExcelFile] = useState<any>();
  const [sheetName, setSheetName] = useState<string[]>();

  const navigate = useNavigate();

  const onHandlingExcelUpload = (excelFile: any) => {
    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        const workbook = XLSX.read(event.target?.result, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet);

        const sheetKey: string[] = Object.values(
          sheetData[4] as string[]
        ).slice(1);

        console.log("sheetKey", sheetKey);
        const sheetValue: IRow[] = sheetData.slice(5) as IRow[];

        setSheetName(sheetKey);

        const customData: IRow[] = sheetValue.map((row) => {
          const newItem: IRow = {};

          sheetKey.map((key, index) => {
            const oldKey = `__EMPTY${index === 0 ? "" : `_${index}`}`;
            newItem[key] = _.has(row, oldKey) ? row[oldKey] : undefined;
          });

          return newItem;
        });

        setExcelFile(customData);
      };

      reader.readAsArrayBuffer(excelFile);
    } catch (error) {
      console.error(error);
    }
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      onHandlingExcelUpload(file);
      onSuccess?.();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Upload: {
            colorFillAlter: "#FFFFFF",
          },
        },
      }}
    >
      {!excelFile ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Card
            styles={{
              header: { height: 100 },
            }}
            className="w-[30%]"
            title={
              <Flex vertical align="start" justify="center">
                <Button
                  onClick={() => navigate("/")}
                  className="p-0"
                  icon={<ArrowLeftOutlined />}
                  type="link"
                >
                  Đóng
                </Button>
                <Typography.Title style={{ fontWeight: "bold" }} level={3}>
                  Upload Excel File
                </Typography.Title>
              </Flex>
            }
          >
            <Dragger
              customRequest={customRequest}
              className="w-full h-full"
              name="file"
              accept=".xlsx"
              multiple={true}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Select a Excel file to upload</p>
              <p className="ant-upload-hint">or drag and drop in here</p>
            </Dragger>
          </Card>
        </div>
      ) : (
        <ExcelTable
          excelFile={excelFile.map((item: any, index: number) => ({
            ...item,
            id: index + 1,
          }))}
          sheetName={sheetName || []}
        />
      )}
    </ConfigProvider>
  );
};

export default TaskOnePage;
