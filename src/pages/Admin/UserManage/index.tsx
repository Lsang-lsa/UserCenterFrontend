import React, {useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {Button, Image, message} from 'antd';
import {useRef} from 'react';
// import request from 'umi-request';
import {usersSearch} from "@/services/ant-design-pro/api";
import CreateModal from "@/pages/Admin/UserManage/components/CreateModal";
// import {request} from "@umijs/max";

const UserAdminPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
  };

  const columns: ProColumns<API.User>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 48,
      hideInForm: true,
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      search: false,
      hideInForm: true,
      render: (_, record) => (
        <>
          <Image
            style={{width: 40, height: 40, borderRadius: '50%'}}
            src={record.avatarUrl}
            alt="avatar"
          />
        </>
      )
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '邮件',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'userStatus',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '角色',
      dataIndex: 'userRole',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '普通用户',
          status: 'Default',
        },
        1: {
          text: '管理员',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      hideInForm: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    // {
    //   title: '操作',
    //   valueType: 'option',
    //   key: 'option',
    //   render: (text, record, _, action) => [
    //     <a
    //       key="editable"
    //       onClick={() => {
    //         action?.startEditable?.(record.id);
    //       }}
    //     >
    //       编辑
    //     </a>,
    //     <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
    //       查看
    //     </a>,
    //     <TableDropdown
    //       key="actionGroup"
    //       onSelect={() => action?.reload()}
    //       menus={[
    //         { key: 'copy', name: '复制' },
    //         { key: 'delete', name: '删除' },
    //       ]}
    //     />,
    //   ],
    // },
  ];

  return (
    <PageContainer>
      <ProTable<API.CurrentUser>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        // @ts-ignore
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          console.log(sortField, sortOrder, filter);
          await waitTime(500);
          try {
            const res = await usersSearch(params);
            console.log('res', res);
            if (res.code === 20000) {
              return {
                success: res?.code === 20000,
                data: res?.data ?? []
              };
            } else {
              throw new Error(res.description);
            }
          } catch (error) {
            const defaultMessage = '请求失败，请稍后再试';
            // @ts-ignore
            message.error(error.message ?? defaultMessage);
          }
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: {fixed: 'right', disable: true},
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined/> 新建
          </Button>,
        ]}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
    </PageContainer>
  );

};
export default UserAdminPage;
