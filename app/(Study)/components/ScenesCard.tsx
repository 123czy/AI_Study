import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Card组件的样式变体配置
 */
const cardVariants = tv({
  slots: {
    base: 'rounded-md border bg-card text-card-foreground shadow-sm cursor-pointer',
    header: 'flex flex-col space-y-1.5 p-6 text-primary',
    title: 'text-2xl font-semibold leading-none tracking-tight',
    description: 'text-lg text-card-foreground/60',
    content: 'p-6 pt-0',
    footer: 'flex items-center p-6 pt-0',
  },
  variants: {
    variant: {
      default: {
        base: 'bg-card border-border hover:border-primary ',
      },
      destructive: {
        base: 'border-destructive/50 text-destructive dark:border-destructive',
      },
      outline: {
        base: 'border-2 border-border bg-transparent hover:scale-105 hover:transition-all duration-300 hover:border-primary',
      },
      secondary: {
        base: 'bg-secondary text-secondary-foreground border-secondary',
      },
    },
    size: {
      default: {
        base: 'w-full',
      },
      sm: {
        base: 'max-w-sm',
        header: 'p-4',
        content: 'p-4 pt-0',
        footer: 'p-4 pt-0',
      },
      lg: {
        base: 'max-w-2xl',
        header: 'p-8',
        content: 'p-8 pt-0',
        footer: 'p-8 pt-0',
      },
    },
    shadow: {
      none: {
        base: 'shadow-none',
      },
      sm: {
        base: 'shadow-sm',
      },
      md: {
        base: 'shadow-md',
      },
      lg: {
        base: 'shadow-lg',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    shadow: 'sm',
  },
});

type CardVariants = VariantProps<typeof cardVariants>;

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardVariants {
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Card主组件
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, shadow, children, ...props }, ref) => {
    const { base } = cardVariants({ variant, size, shadow });
    
    return (
      <div
        ref={ref}
        className={base({ className })}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

/**
 * Card头部组件
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { header } = cardVariants();
    
    return (
      <div
        ref={ref}
        className={header({ className })}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

/**
 * Card标题组件
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { title } = cardVariants();
    
    return (
      <h3
        ref={ref}
        className={title({ className })}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

/**
 * Card描述组件
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const { description } = cardVariants();
    
    return (
      <p
        ref={ref}
        className={description({ className })}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

/**
 * Card内容组件
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    const { content } = cardVariants();
    
    return (
      <div
        ref={ref}
        className={content({ className })}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

/**
 * Card底部组件
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { footer } = cardVariants();
    
    return (
      <div
        ref={ref}
        className={footer({ className })}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardVariants,
};