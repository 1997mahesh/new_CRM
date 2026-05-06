import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({ className, children, ...props }: AccordionPrimitive.Root.Props) {
  const { collapsible, ...rest } = props as any
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      collapsible={collapsible}
      {...rest}
      render={(renderProps) => {
        const { collapsible: _c, ...htmlProps } = renderProps as any
        return (
          <div 
            {...htmlProps} 
            data-collapsible={_c} 
            className={cn("flex w-full flex-col", className)}
          >
            {children}
          </div>
        )
      }}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  hideChevron,
  ...props
}: AccordionPrimitive.Trigger.Props & { hideChevron?: boolean }) {
  const { asChild, ...rest } = props as any
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        render={asChild ? (children as React.ReactElement) : undefined}
        {...rest}
      >
        {!asChild && children}
        {!asChild && !hideChevron && (
          <ChevronDownIcon 
            data-slot="accordion-trigger-icon" 
            className="pointer-events-none size-4 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180 text-muted-foreground" 
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
