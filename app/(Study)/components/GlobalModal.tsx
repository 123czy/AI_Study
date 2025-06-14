'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// Modal配置接口
interface ModalConfig {
  title?: string
  description?: string
  content?: ReactNode
  showCancel?: boolean
  showConfirm?: boolean
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: () => void
  onClose?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Modal上下文接口
interface ModalContextType {
  showModal: (config: ModalConfig) => void
  hideModal: () => void
  isOpen: boolean
}

// 创建上下文
const ModalContext = createContext<ModalContextType | null>(null)

/**
 * 单例Modal管理器类
 * 确保整个应用中只有一个Modal实例
 */
class ModalManager {
  private static instance: ModalManager
  private modalConfig: ModalConfig | null = null
  private isVisible: boolean = false
  private listeners: Set<() => void> = new Set()

  /**
   * 获取单例实例
   */
  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager()
    }
    return ModalManager.instance
  }

  /**
   * 显示Modal
   * @param config Modal配置
   */
  show(config: ModalConfig): void {
    this.modalConfig = config
    this.isVisible = true
    this.notifyListeners()
  }

  /**
   * 隐藏Modal
   */
  hide(): void {
    this.isVisible = false
    this.modalConfig = null
    this.notifyListeners()
  }

  /**
   * 获取当前状态
   */
  getState(): { isVisible: boolean; config: ModalConfig | null } {
    return {
      isVisible: this.isVisible,
      config: this.modalConfig
    }
  }

  /**
   * 添加状态监听器
   * @param listener 监听器函数
   */
  addListener(listener: () => void): void {
    this.listeners.add(listener)
  }

  /**
   * 移除状态监听器
   * @param listener 监听器函数
   */
  removeListener(listener: () => void): void {
    this.listeners.delete(listener)
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }
}

/**
 * Modal提供者组件
 * 包装应用并提供全局Modal功能
 */
export const GlobalModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState(() => ModalManager.getInstance().getState())
  const modalManager = ModalManager.getInstance()

  // 监听Modal状态变化
  React.useEffect(() => {
    const updateState = () => {
      setModalState(modalManager.getState())
    }

    modalManager.addListener(updateState)
    return () => modalManager.removeListener(updateState)
  }, [])

  /**
   * 显示Modal
   * @param config Modal配置
   */
  const showModal = useCallback((config: ModalConfig) => {
    modalManager.show(config)
  }, [])

  /**
   * 隐藏Modal
   */
  const hideModal = useCallback(() => {
    modalManager.hide()
  }, [])

  /**
   * 处理Modal关闭
   */
  const handleClose = useCallback(() => {
    if (modalState.config?.onClose) {
      modalState.config.onClose()
    }
    hideModal()
  }, [modalState.config, hideModal])

  /**
   * 处理取消按钮点击
   */
  const handleCancel = useCallback(() => {
    if (modalState.config?.onCancel) {
      modalState.config.onCancel()
    }
    hideModal()
  }, [modalState.config, hideModal])

  /**
   * 处理确认按钮点击
   */
  const handleConfirm = useCallback(() => {
    if (modalState.config?.onConfirm) {
      modalState.config.onConfirm()
    }
    hideModal()
  }, [modalState.config, hideModal])

  /**
   * 获取Modal尺寸类名
   */
  const getSizeClass = (size?: string) => {
    switch (size) {
      case 'sm': return 'w-[90vw] max-w-[320px] sm:max-w-sm'
      case 'md': return 'w-[90vw] max-w-[375px] sm:max-w-md'
      case 'lg': return 'w-[92vw] max-w-[420px] sm:max-w-lg'
      case 'xl': return 'w-[95vw] max-w-[480px] sm:max-w-xl'
      default: return 'w-[90vw] max-w-[375px] sm:max-w-md'
    }
  }

  const contextValue: ModalContextType = {
    showModal,
    hideModal,
    isOpen: modalState.isVisible
  }

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {/* 全局Modal组件 */}
      <Dialog open={modalState.isVisible} onOpenChange={handleClose}>
        <DialogContent className={`${getSizeClass(modalState.config?.size)} min-h-[200px] max-h-[min(100dvh-32px,900px)] h-fit overflow-y-auto`}>
          {(modalState.config?.title || modalState.config?.description) && (
            <DialogHeader>
              {modalState.config?.title && (
                <DialogTitle className="text-card-foreground text-lg font-semibold">
                  {modalState.config.title}
                </DialogTitle>
              )}
              {modalState.config?.description && (
                <DialogDescription className="text-md text-card-foreground/60">
                  {modalState.config.description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          
          {/* Modal内容 */}
          {modalState.config?.content && (
            <div className="py-4">
              {modalState.config.content}
            </div>
          )}
          
          {/* 按钮区域 */}
          {(modalState.config?.showCancel || modalState.config?.showConfirm) && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              {modalState.config?.showCancel && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  {modalState.config?.cancelText || '取消'}
                </Button>
              )}
              {modalState.config?.showConfirm && (
                <Button
                  onClick={handleConfirm}
                >
                  {modalState.config?.confirmText || '确认'}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  )
}

/**
 * 使用Modal的Hook
 * 提供便捷的Modal操作方法
 */
export const useGlobalModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider')
  }
  return context
}

/**
 * 全局Modal工具函数
 * 可以在任何地方调用，无需Hook
 */
export const globalModal = {
  /**
   * 显示确认对话框
   * @param title 标题
   * @param description 描述
   * @param onConfirm 确认回调
   * @param onCancel 取消回调
   */
  confirm: (title: string, description?: string, onConfirm?: () => void, onCancel?: () => void) => {
    ModalManager.getInstance().show({
      title,
      description,
      showCancel: true,
      showConfirm: true,
      onConfirm,
      onCancel
    })
  },

  /**
   * 显示警告对话框
   * @param title 标题
   * @param description 描述
   * @param onConfirm 确认回调
   */
  alert: (title: string, description?: string, onConfirm?: () => void) => {
    ModalManager.getInstance().show({
      title,
      description,
      showConfirm: true,
      confirmText: '确定',
      onConfirm
    })
  },

  /**
   * 显示自定义内容Modal
   * @param config Modal配置
   */
  show: (config: ModalConfig) => {
    ModalManager.getInstance().show(config)
  },

  /**
   * 隐藏Modal
   */
  hide: () => {
    ModalManager.getInstance().hide()
  }
}