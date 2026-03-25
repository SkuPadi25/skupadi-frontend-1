import Icon from "../AppIcon";
import Button from "./Button";
import { cn } from "../../utils/cn";

const EmptyState = ({
  icon = "Inbox",
  title = "Nothing here yet",
  description = "There is no data to display.",
  actionLabel,
  onAction,
  actionIcon = null,
  actionVariant = "navy",
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionIcon = null,
  secondaryActionVariant = "outline",
  variant = "page",
  className = "",
  contentClassName = "",
}) => {
  const hasPrimaryAction = Boolean(actionLabel && onAction);
  const hasSecondaryAction = Boolean(secondaryActionLabel && onSecondaryAction);
  const showActions = hasPrimaryAction || hasSecondaryAction;

  const variantClasses = {
    page: "py-20 px-6",
    section: "py-16 px-6",
    compact: "py-10 px-4",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variantClasses[variant] || variantClasses.page,
        className
      )}
    >
      
      {/* Icon */}
      <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <Icon name={icon} size={32} className="text-muted-foreground" />
      </div>

      <div className={cn("w-full max-w-md", contentClassName)}>
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>

        {/* Description */}
        {description ? (
          <p className="text-sm text-muted-foreground mb-6">
            {description}
          </p>
        ) : null}

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasPrimaryAction && (
              <Button
                variant={actionVariant}
                iconName={actionIcon}
                iconSize={16}
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            )}

            {hasSecondaryAction && (
              <Button
                variant={secondaryActionVariant}
                size="default"
                iconName={secondaryActionIcon}
                iconSize={16}
                onClick={onSecondaryAction}
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default EmptyState;
