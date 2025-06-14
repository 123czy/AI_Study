'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useGlobalModal, globalModal } from './GlobalModal'

/**
 * Modal使用示例组件
 * 展示各种Modal使用方式
 */
export const ModalExample: React.FC = () => {
  const { showModal } = useGlobalModal()

  /**
   * 显示确认对话框示例
   */
  const handleConfirmExample = () => {
    globalModal.confirm(
      '删除确认',
      '确定要删除这个项目吗？此操作不可撤销。',
      () => {
        console.log('用户确认删除')
        globalModal.alert('删除成功', '项目已成功删除')
      },
      () => {
        console.log('用户取消删除')
      }
    )
  }

  /**
   * 显示警告对话框示例
   */
  const handleAlertExample = () => {
    globalModal.alert(
      '操作提示',
      '这是一个警告信息，请注意查看。',
      () => {
        console.log('用户点击了确定')
      }
    )
  }

  /**
   * 显示自定义内容Modal示例
   */
  const handleCustomExample = () => {
    showModal({
      title: '自定义内容',
      size: 'lg',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            这是一个自定义内容的Modal示例。
          </p>
          <div className="bg-accent p-4 rounded-md">
            <h4 className="font-medium mb-2">功能特点：</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>单例模式确保全局唯一</li>
              <li>支持多种尺寸和配置</li>
              <li>可以在任何地方调用</li>
              <li>支持自定义内容和按钮</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              示例按钮1
            </Button>
            <Button size="sm">
              示例按钮2
            </Button>
          </div>
        </div>
      ),
      showCancel: true,
      showConfirm: true,
      confirmText: '保存',
      cancelText: '取消',
      onConfirm: () => {
        console.log('保存自定义内容')
      }
    })
  }

  /**
   * 显示表单Modal示例
   */
  const handleFormExample = () => {
    showModal({
      title: '添加新项目',
      description: '请填写项目信息',
      size: 'md',
      content: (
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">项目名称</label>
            <input 
              type="text" 
              className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="请输入项目名称"
            />
          </div>
          <div>
            <label className="text-sm font-medium">项目描述</label>
            <textarea 
              className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="请输入项目描述"
            />
          </div>
        </form>
      ),
      showCancel: true,
      showConfirm: true,
      confirmText: '创建',
      onConfirm: () => {
        console.log('创建新项目')
      }
    })
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-6">全局Modal示例</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button onClick={handleConfirmExample} variant="destructive">
          确认对话框
        </Button>
        
        <Button onClick={handleAlertExample} variant="secondary">
          警告对话框
        </Button>
        
        <Button onClick={handleCustomExample}>
          自定义内容
        </Button>
        
        <Button onClick={handleFormExample} variant="outline">
          表单Modal
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">使用说明：</h3>
        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
          <li>使用 <code className="bg-background px-1 rounded">useGlobalModal()</code> Hook 在组件中调用</li>
          <li>使用 <code className="bg-background px-1 rounded">globalModal</code> 工具函数在任何地方调用</li>
          <li>支持确认、警告、自定义内容等多种类型</li>
          <li>单例模式确保全局只有一个Modal实例</li>
        </ul>
      </div>
    </div>
  )
}