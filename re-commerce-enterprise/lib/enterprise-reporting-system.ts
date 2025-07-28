
/**
 * ENTERPRISE REPORTING SYSTEM
 * Automated report generation, custom report builder, multi-format export,
 * white-label reporting, compliance reporting, and scheduled distribution
 */

import { prisma } from '@/lib/db';
import { eventBus } from '@/lib/event-bus-system';
import { dataWarehouse } from '@/lib/multidimensional-data-warehouse';
import type {
  ReportSecurity,
  ReportScheduling,
  ReportDistribution,
  ReportVersioning,
  ReportMetadata,
  TransformationRule,
  AggregationFunction,
  WindowFunction,
  ValidationRule,
  ResponsiveBreakpoint,
  IndexStatistics,
  IndexMetadata,
  DataQuality,
  DataLineage,
  PolicyRule,
  MaskingRule,
  ComplianceRequirement,
  ComplianceControl,
  ComplianceAssessment,
  ComplianceReporting,
  NodeResources,
  ScalingPolicy,
  HealthCheck,
  AlertRule,
  AlertEscalation,
  AlertSuppression,
  StylingResponsive,
  StylingAccessibility,
  StylingPrint,
  StylingInteractive,
  StylingAnimation,
  StylingBranding,
  StylingCustomization,
  EffectBlend
} from '@/lib/types';

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  type: 'tabular' | 'chart' | 'dashboard' | 'matrix' | 'subreport' | 'crosstab' | 'drill_through';
  category: 'operational' | 'analytical' | 'compliance' | 'executive' | 'ad_hoc' | 'regulatory';
  template: ReportTemplate;
  dataSource: ReportDataSource;
  parameters: ReportParameter[];
  layout: ReportLayout;
  styling: ReportStyling;
  security: ReportSecurity;
  scheduling: ReportScheduling;
  distribution: ReportDistribution;
  versioning: ReportVersioning;
  metadata: ReportMetadata;
  tenantId: string;
  createdAt: Date;
  lastModified: Date;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'standard' | 'custom' | 'white_label' | 'regulatory';
  structure: TemplateStructure;
  components: TemplateComponent[];
  variables: TemplateVariable[];
  formatting: TemplateFormatting;
  branding: TemplateBranding;
  localization: TemplateLocalization;
  validation: TemplateValidation;
}

export interface TemplateStructure {
  header: TemplateSection;
  body: TemplateSection;
  footer: TemplateSection;
  pages: TemplatePage[];
  sections: TemplateSection[];
  layout: 'single_column' | 'multi_column' | 'grid' | 'free_form';
  orientation: 'portrait' | 'landscape';
  size: 'letter' | 'a4' | 'legal' | 'custom';
  margins: TemplateMargins;
  watermark: TemplateWatermark;
}

export interface TemplateSection {
  id: string;
  name: string;
  type: 'header' | 'body' | 'footer' | 'detail' | 'group' | 'summary';
  position: SectionPosition;
  content: SectionContent[];
  formatting: SectionFormatting;
  visibility: SectionVisibility;
  repeating: boolean;
  grouping: SectionGrouping;
  sorting: SectionSorting;
  filtering: SectionFiltering;
}

export interface SectionPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  alignment: 'left' | 'center' | 'right' | 'justify';
  anchor: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface SectionContent {
  id: string;
  type: 'text' | 'image' | 'chart' | 'table' | 'field' | 'barcode' | 'qr_code' | 'line' | 'shape';
  data: any;
  formatting: ContentFormatting;
  position: ContentPosition;
  binding: ContentBinding;
  conditions: ContentCondition[];
  interactions: ContentInteraction[];
}

export interface ContentFormatting {
  font: FontFormatting;
  color: ColorFormatting;
  border: BorderFormatting;
  background: BackgroundFormatting;
  padding: PaddingFormatting;
  alignment: AlignmentFormatting;
}

export interface FontFormatting {
  family: string;
  size: number;
  weight: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  style: 'normal' | 'italic' | 'oblique';
  variant: 'normal' | 'small-caps';
  decoration: 'none' | 'underline' | 'overline' | 'line-through';
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
}

export interface ColorFormatting {
  text: string;
  background: string;
  border: string;
  highlight: string;
  link: string;
  visited: string;
  hover: string;
  active: string;
}

export interface BorderFormatting {
  width: number;
  style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  color: string;
  radius: number;
  collapse: boolean;
  spacing: number;
}

export interface BackgroundFormatting {
  color: string;
  image: string;
  repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y' | 'space' | 'round';
  position: string;
  size: 'auto' | 'cover' | 'contain' | string;
  attachment: 'scroll' | 'fixed' | 'local';
  gradient: GradientFormatting;
}

export interface GradientFormatting {
  type: 'linear' | 'radial' | 'conic';
  direction: string;
  colors: ColorStop[];
  repeating: boolean;
}

export interface ColorStop {
  color: string;
  position: number;
  hint?: number;
}

export interface PaddingFormatting {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface AlignmentFormatting {
  horizontal: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
  vertical: 'top' | 'middle' | 'bottom' | 'baseline' | 'sub' | 'super';
  textAlign: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
  textIndent: number;
  textTransform: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width';
}

export interface ContentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  relative: boolean;
  absolute: boolean;
  fixed: boolean;
  sticky: boolean;
}

export interface ContentBinding {
  field: string;
  source: string;
  expression: string;
  format: string;
  calculation: string;
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'first' | 'last' | 'distinct';
  grouping: string;
  filtering: string;
  sorting: string;
}

export interface ContentCondition {
  expression: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'matches';
  value: any;
  action: 'show' | 'hide' | 'highlight' | 'format' | 'calculate';
  formatting: ContentFormatting;
}

export interface ContentInteraction {
  type: 'click' | 'hover' | 'double_click' | 'right_click' | 'key_press';
  action: 'drill_down' | 'drill_through' | 'navigate' | 'filter' | 'sort' | 'export' | 'print';
  target: string;
  parameters: any;
  conditions: string[];
}

export interface SectionFormatting {
  background: BackgroundFormatting;
  border: BorderFormatting;
  padding: PaddingFormatting;
  margin: PaddingFormatting;
  spacing: number;
  alignment: AlignmentFormatting;
}

export interface SectionVisibility {
  condition: string;
  roles: string[];
  users: string[];
  groups: string[];
  permissions: string[];
  dynamic: boolean;
}

export interface SectionGrouping {
  enabled: boolean;
  field: string;
  expression: string;
  sorting: 'ascending' | 'descending' | 'none';
  header: GroupHeader;
  footer: GroupFooter;
  pageBreak: 'before' | 'after' | 'avoid' | 'none';
  keepTogether: boolean;
}

export interface GroupHeader {
  enabled: boolean;
  content: SectionContent[];
  formatting: SectionFormatting;
  height: number;
  repeating: boolean;
}

export interface GroupFooter {
  enabled: boolean;
  content: SectionContent[];
  formatting: SectionFormatting;
  height: number;
  aggregations: GroupAggregation[];
}

export interface GroupAggregation {
  field: string;
  function: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'first' | 'last' | 'distinct';
  format: string;
  label: string;
  position: ContentPosition;
}

export interface SectionSorting {
  enabled: boolean;
  fields: SortField[];
  interactive: boolean;
  defaultSort: string;
  multiColumn: boolean;
  stable: boolean;
}

export interface SortField {
  field: string;
  direction: 'ascending' | 'descending';
  priority: number;
  nulls: 'first' | 'last';
  caseSensitive: boolean;
  collation: string;
}

export interface SectionFiltering {
  enabled: boolean;
  filters: ReportFilter[];
  interactive: boolean;
  defaultFilter: string;
  multiValue: boolean;
  cascading: boolean;
}

export interface ReportFilter {
  id: string;
  name: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with' | 'matches' | 'is_null' | 'is_not_null';
  value: any;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'list';
  required: boolean;
  hidden: boolean;
  multiSelect: boolean;
  defaultValue: any;
  options: FilterOption[];
  validation: FilterValidation;
}

export interface FilterOption {
  value: any;
  label: string;
  description: string;
  group: string;
  enabled: boolean;
  selected: boolean;
}

export interface FilterValidation {
  required: boolean;
  minLength: number;
  maxLength: number;
  minValue: number;
  maxValue: number;
  pattern: string;
  customValidation: string;
  errorMessage: string;
}

export interface TemplatePage {
  id: string;
  name: string;
  order: number;
  orientation: 'portrait' | 'landscape';
  size: string;
  margins: TemplateMargins;
  header: TemplateSection;
  footer: TemplateSection;
  body: TemplateSection;
  watermark: TemplateWatermark;
  pageBreak: 'auto' | 'always' | 'avoid' | 'left' | 'right';
}

export interface TemplateMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
  header: number;
  footer: number;
}

export interface TemplateWatermark {
  enabled: boolean;
  type: 'text' | 'image';
  content: string;
  opacity: number;
  position: 'center' | 'diagonal' | 'custom';
  size: 'auto' | 'fit' | 'custom';
  color: string;
  font: FontFormatting;
  rotation: number;
  repeating: boolean;
}

export interface TemplateComponent {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'text' | 'image' | 'barcode' | 'qr_code' | 'field' | 'calculation' | 'subreport';
  properties: ComponentProperties;
  configuration: ComponentConfiguration;
  data: ComponentData;
  formatting: ComponentFormatting;
  interactions: ComponentInteraction[];
  validation: ComponentValidation;
}

export interface ComponentProperties {
  position: ContentPosition;
  size: ComponentSize;
  visibility: ComponentVisibility;
  behavior: ComponentBehavior;
  accessibility: ComponentAccessibility;
}

export interface ComponentSize {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  autoSize: boolean;
  aspectRatio: number;
  responsive: boolean;
}

export interface ComponentVisibility {
  visible: boolean;
  condition: string;
  roles: string[];
  users: string[];
  groups: string[];
  permissions: string[];
  printVisible: boolean;
  exportVisible: boolean;
}

export interface ComponentBehavior {
  interactive: boolean;
  clickable: boolean;
  draggable: boolean;
  resizable: boolean;
  selectable: boolean;
  focusable: boolean;
  disabled: boolean;
  readOnly: boolean;
}

export interface ComponentAccessibility {
  label: string;
  description: string;
  role: string;
  tabIndex: number;
  ariaLabel: string;
  ariaDescribedBy: string;
  ariaExpandedBy: string;
  keyboardNavigation: boolean;
  screenReader: boolean;
}

export interface ComponentConfiguration {
  chart?: ChartConfiguration;
  table?: TableConfiguration;
  text?: TextConfiguration;
  image?: ImageConfiguration;
  barcode?: BarcodeConfiguration;
  qrCode?: QRCodeConfiguration;
  field?: FieldConfiguration;
  calculation?: CalculationConfiguration;
  subreport?: SubreportConfiguration;
}

export interface ChartConfiguration {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'column' | 'donut' | 'gauge' | 'waterfall' | 'treemap' | 'heatmap' | 'bubble' | 'candlestick' | 'radar' | 'funnel' | 'sankey';
  series: ChartSeries[];
  axes: ChartAxis[];
  legend: ChartLegend;
  tooltip: ChartTooltip;
  animation: ChartAnimation;
  interaction: ChartInteraction;
  theme: ChartTheme;
  responsive: boolean;
  export: ChartExport;
}

export interface ChartSeries {
  name: string;
  type: string;
  data: string;
  xField: string;
  yField: string;
  color: string;
  marker: ChartMarker;
  line: ChartLine;
  area: ChartArea;
  label: ChartLabel;
  tooltip: ChartTooltip;
  animation: ChartAnimation;
}

export interface ChartMarker {
  enabled: boolean;
  type: 'circle' | 'square' | 'diamond' | 'triangle' | 'cross' | 'star' | 'custom';
  size: number;
  color: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

export interface ChartLine {
  enabled: boolean;
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'dash_dot' | 'dash_dot_dot';
  opacity: number;
  smooth: boolean;
  tension: number;
}

export interface ChartArea {
  enabled: boolean;
  color: string;
  opacity: number;
  gradient: boolean;
  gradientStops: ColorStop[];
  pattern: string;
}

export interface ChartLabel {
  enabled: boolean;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'inside' | 'outside';
  format: string;
  font: FontFormatting;
  color: string;
  background: string;
  border: BorderFormatting;
  padding: PaddingFormatting;
  rotation: number;
  offset: number;
}

export interface ChartAxis {
  id: string;
  type: 'x' | 'y' | 'z';
  position: 'bottom' | 'top' | 'left' | 'right';
  title: ChartAxisTitle;
  labels: ChartAxisLabels;
  line: ChartLine;
  grid: ChartGrid;
  scale: ChartScale;
  range: ChartRange;
  ticks: ChartTicks;
}

export interface ChartAxisTitle {
  enabled: boolean;
  text: string;
  position: 'start' | 'middle' | 'end';
  font: FontFormatting;
  color: string;
  rotation: number;
  offset: number;
}

export interface ChartAxisLabels {
  enabled: boolean;
  format: string;
  font: FontFormatting;
  color: string;
  rotation: number;
  offset: number;
  staggered: boolean;
  interval: number;
  maxWidth: number;
}

export interface ChartGrid {
  enabled: boolean;
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  opacity: number;
  zIndex: number;
}

export interface ChartScale {
  type: 'linear' | 'log' | 'time' | 'ordinal' | 'band' | 'point';
  domain: [number, number];
  range: [number, number];
  padding: number;
  nice: boolean;
  clamp: boolean;
}

export interface ChartRange {
  min: number;
  max: number;
  auto: boolean;
  padding: number;
  symmetric: boolean;
}

export interface ChartTicks {
  enabled: boolean;
  count: number;
  values: number[];
  size: number;
  color: string;
  width: number;
  inside: boolean;
  outside: boolean;
}

export interface ChartLegend {
  enabled: boolean;
  position: 'top' | 'bottom' | 'left' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
  orientation: 'horizontal' | 'vertical';
  alignment: 'start' | 'center' | 'end';
  font: FontFormatting;
  color: string;
  background: string;
  border: BorderFormatting;
  padding: PaddingFormatting;
  margin: PaddingFormatting;
  itemSpacing: number;
  symbolWidth: number;
  symbolHeight: number;
  maxWidth: number;
  maxHeight: number;
  scrollable: boolean;
  interactive: boolean;
}

export interface ChartTooltip {
  enabled: boolean;
  trigger: 'hover' | 'click' | 'focus';
  format: string;
  font: FontFormatting;
  color: string;
  background: string;
  border: BorderFormatting;
  padding: PaddingFormatting;
  shadow: boolean;
  animation: boolean;
  followPointer: boolean;
  shared: boolean;
  crosshairs: boolean;
}

export interface ChartAnimation {
  enabled: boolean;
  duration: number;
  easing: 'linear' | 'ease' | 'ease_in' | 'ease_out' | 'ease_in_out' | 'bounce' | 'elastic';
  delay: number;
  stagger: number;
  loop: boolean;
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate_reverse';
}

export interface ChartInteraction {
  zoom: boolean;
  pan: boolean;
  select: boolean;
  brush: boolean;
  crossfilter: boolean;
  drill_down: boolean;
  drill_through: boolean;
  export: boolean;
  print: boolean;
}

export interface ChartTheme {
  name: string;
  colors: string[];
  background: string;
  font: FontFormatting;
  grid: ChartGrid;
  axis: ChartAxis;
  legend: ChartLegend;
  tooltip: ChartTooltip;
  custom: any;
}

export interface ChartExport {
  enabled: boolean;
  formats: string[];
  filename: string;
  width: number;
  height: number;
  scale: number;
  background: string;
  quality: number;
}

export interface TableConfiguration {
  columns: TableColumn[];
  rows: TableRow[];
  header: TableHeader;
  footer: TableFooter;
  grouping: TableGrouping;
  sorting: TableSorting;
  filtering: TableFiltering;
  pagination: TablePagination;
  selection: TableSelection;
  editing: TableEditing;
  styling: TableStyling;
  export: TableExport;
}

export interface TableColumn {
  id: string;
  name: string;
  field: string;
  title: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'link' | 'custom';
  width: number;
  minWidth: number;
  maxWidth: number;
  resizable: boolean;
  sortable: boolean;
  filterable: boolean;
  editable: boolean;
  visible: boolean;
  frozen: boolean;
  alignment: 'left' | 'center' | 'right';
  format: string;
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'first' | 'last' | 'distinct';
  validation: ColumnValidation;
  conditional: ColumnConditional[];
}

export interface ColumnValidation {
  required: boolean;
  minLength: number;
  maxLength: number;
  minValue: number;
  maxValue: number;
  pattern: string;
  customValidation: string;
  errorMessage: string;
}

export interface ColumnConditional {
  condition: string;
  formatting: ContentFormatting;
  action: 'format' | 'hide' | 'disable' | 'readonly';
  value: any;
}

export interface TableRow {
  id: string;
  data: any;
  formatting: ContentFormatting;
  selected: boolean;
  expanded: boolean;
  editable: boolean;
  deletable: boolean;
  children: TableRow[];
  level: number;
  group: string;
}

export interface TableHeader {
  enabled: boolean;
  sticky: boolean;
  resizable: boolean;
  sortable: boolean;
  filterable: boolean;
  groupable: boolean;
  height: number;
  formatting: ContentFormatting;
  multiLine: boolean;
  wordWrap: boolean;
}

export interface TableFooter {
  enabled: boolean;
  sticky: boolean;
  height: number;
  formatting: ContentFormatting;
  aggregations: TableAggregation[];
  summary: TableSummary;
}

export interface TableAggregation {
  column: string;
  function: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'first' | 'last' | 'distinct';
  format: string;
  label: string;
  position: 'left' | 'center' | 'right';
}

export interface TableSummary {
  enabled: boolean;
  position: 'top' | 'bottom' | 'both';
  content: string;
  formatting: ContentFormatting;
}

export interface TableGrouping {
  enabled: boolean;
  field: string;
  expandable: boolean;
  expanded: boolean;
  header: boolean;
  footer: boolean;
  aggregations: TableAggregation[];
  sorting: 'ascending' | 'descending' | 'none';
}

export interface TableSorting {
  enabled: boolean;
  multiColumn: boolean;
  stable: boolean;
  serverSide: boolean;
  initialSort: SortField[];
  customSort: string;
}

export interface TableFiltering {
  enabled: boolean;
  mode: 'simple' | 'advanced' | 'excel';
  serverSide: boolean;
  case_sensitive: boolean;
  operators: string[];
  customFilter: string;
}

export interface TablePagination {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions: number[];
  showInfo: boolean;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  position: 'top' | 'bottom' | 'both';
  type: 'simple' | 'full' | 'mini';
}

export interface TableSelection {
  enabled: boolean;
  mode: 'single' | 'multiple';
  checkboxes: boolean;
  radio: boolean;
  rowClick: boolean;
  preserveSelection: boolean;
  selectedRowKeys: string[];
}

export interface TableEditing {
  enabled: boolean;
  mode: 'inline' | 'popup' | 'cell';
  trigger: 'click' | 'double_click' | 'manual';
  validation: boolean;
  cancellable: boolean;
  confirmOnExit: boolean;
  autoSave: boolean;
  batchUpdate: boolean;
}

export interface TableStyling {
  striped: boolean;
  bordered: boolean;
  hover: boolean;
  condensed: boolean;
  responsive: boolean;
  theme: string;
  customCSS: string;
  rowHeight: number;
  columnSpacing: number;
  cellPadding: PaddingFormatting;
}

export interface TableExport {
  enabled: boolean;
  formats: string[];
  filename: string;
  includeHeaders: boolean;
  includeFooters: boolean;
  selectedOnly: boolean;
  visibleOnly: boolean;
  customization: ExportCustomization;
}

export interface ExportCustomization {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  formatting: boolean;
  images: boolean;
  links: boolean;
  comments: boolean;
}

export interface TextConfiguration {
  content: string;
  format: 'plain' | 'html' | 'markdown' | 'rich_text';
  font: FontFormatting;
  color: ColorFormatting;
  alignment: AlignmentFormatting;
  spacing: TextSpacing;
  effects: TextEffects;
  links: TextLinks;
  lists: TextLists;
  tables: TextTables;
  images: TextImages;
  localization: TextLocalization;
}

export interface TextSpacing {
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  paragraphSpacing: number;
  indentation: number;
  margins: PaddingFormatting;
  padding: PaddingFormatting;
}

export interface TextEffects {
  shadow: TextShadow;
  outline: TextOutline;
  glow: TextGlow;
  gradient: GradientFormatting;
  animation: TextAnimation;
}

export interface TextShadow {
  enabled: boolean;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
}

export interface TextOutline {
  enabled: boolean;
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface TextGlow {
  enabled: boolean;
  color: string;
  size: number;
  intensity: number;
}

export interface TextAnimation {
  enabled: boolean;
  type: 'none' | 'fade' | 'slide' | 'bounce' | 'rotate' | 'scale' | 'pulse';
  duration: number;
  delay: number;
  iteration: number;
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate_reverse';
  timing: 'linear' | 'ease' | 'ease_in' | 'ease_out' | 'ease_in_out';
}

export interface TextLinks {
  enabled: boolean;
  color: string;
  visitedColor: string;
  hoverColor: string;
  activeColor: string;
  decoration: 'none' | 'underline' | 'overline' | 'line-through';
  target: '_self' | '_blank' | '_parent' | '_top';
  nofollow: boolean;
  tracking: boolean;
}

export interface TextLists {
  enabled: boolean;
  type: 'bullet' | 'numbered' | 'custom';
  style: string;
  indentation: number;
  spacing: number;
  marker: ListMarker;
  nesting: boolean;
  maxDepth: number;
}

export interface ListMarker {
  type: 'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'roman' | 'custom';
  color: string;
  size: number;
  position: 'inside' | 'outside';
  image: string;
  content: string;
}

export interface TextTables {
  enabled: boolean;
  borders: boolean;
  striped: boolean;
  hover: boolean;
  condensed: boolean;
  responsive: boolean;
  cellPadding: PaddingFormatting;
  cellSpacing: number;
  caption: TableCaption;
  headers: TableHeaders;
}

export interface TableCaption {
  enabled: boolean;
  text: string;
  position: 'top' | 'bottom';
  alignment: 'left' | 'center' | 'right';
  font: FontFormatting;
}

export interface TableHeaders {
  enabled: boolean;
  sticky: boolean;
  background: string;
  color: string;
  font: FontFormatting;
  border: BorderFormatting;
}

export interface TextImages {
  enabled: boolean;
  maxWidth: number;
  maxHeight: number;
  alignment: 'left' | 'center' | 'right' | 'justify';
  spacing: number;
  border: BorderFormatting;
  shadow: boolean;
  rounded: boolean;
  responsive: boolean;
  lazy: boolean;
  alt: boolean;
  caption: ImageCaption;
}

export interface ImageCaption {
  enabled: boolean;
  position: 'top' | 'bottom';
  alignment: 'left' | 'center' | 'right';
  font: FontFormatting;
  color: string;
  background: string;
  padding: PaddingFormatting;
}

export interface TextLocalization {
  enabled: boolean;
  language: string;
  direction: 'ltr' | 'rtl';
  locale: string;
  dateFormat: string;
  numberFormat: string;
  currencyFormat: string;
  timeZone: string;
  translations: Record<string, string>;
}

export interface ImageConfiguration {
  source: string;
  type: 'static' | 'dynamic' | 'data_bound';
  format: 'png' | 'jpg' | 'gif' | 'svg' | 'webp' | 'bmp' | 'tiff';
  quality: number;
  compression: boolean;
  width: number;
  height: number;
  aspectRatio: 'preserve' | 'stretch' | 'crop' | 'fit';
  alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
  scaling: 'none' | 'fit' | 'fill' | 'stretch' | 'tile';
  rotation: number;
  flip: 'none' | 'horizontal' | 'vertical' | 'both';
  opacity: number;
  filters: ImageFilter[];
  effects: ImageEffect[];
  watermark: ImageWatermark;
  metadata: ImageMetadata;
}

export interface ImageFilter {
  type: 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'hue_rotate' | 'invert' | 'opacity' | 'saturate' | 'sepia';
  value: number;
  unit: string;
}

export interface ImageEffect {
  type: 'drop_shadow' | 'inner_shadow' | 'glow' | 'bevel' | 'emboss' | 'outline';
  parameters: any;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft_light' | 'hard_light' | 'color_dodge' | 'color_burn' | 'darken' | 'lighten' | 'difference' | 'exclusion';
}

export interface ImageWatermark {
  enabled: boolean;
  type: 'text' | 'image' | 'logo';
  content: string;
  position: 'top_left' | 'top_center' | 'top_right' | 'center_left' | 'center' | 'center_right' | 'bottom_left' | 'bottom_center' | 'bottom_right';
  opacity: number;
  scale: number;
  rotation: number;
  margin: PaddingFormatting;
  blendMode: string;
}

export interface ImageMetadata {
  title: string;
  description: string;
  alt: string;
  author: string;
  copyright: string;
  keywords: string[];
  exif: boolean;
  iptc: boolean;
  xmp: boolean;
}

export interface BarcodeConfiguration {
  type: 'code128' | 'code39' | 'code93' | 'codabar' | 'ean13' | 'ean8' | 'upc_a' | 'upc_e' | 'isbn' | 'issn' | 'datamatrix' | 'pdf417' | 'qr_code' | 'aztec';
  data: string;
  width: number;
  height: number;
  quietZone: number;
  showText: boolean;
  textPosition: 'top' | 'bottom' | 'none';
  textAlignment: 'left' | 'center' | 'right';
  font: FontFormatting;
  color: string;
  backgroundColor: string;
  border: BorderFormatting;
  errorCorrection: 'low' | 'medium' | 'quartile' | 'high';
  encoding: 'auto' | 'utf8' | 'ascii' | 'latin1' | 'binary';
  format: 'png' | 'jpg' | 'gif' | 'svg';
  dpi: number;
  scale: number;
  rotation: number;
}

export interface QRCodeConfiguration {
  data: string;
  size: number;
  quietZone: number;
  errorCorrection: 'low' | 'medium' | 'quartile' | 'high';
  encoding: 'auto' | 'utf8' | 'ascii' | 'latin1' | 'binary';
  foregroundColor: string;
  backgroundColor: string;
  logo: QRCodeLogo;
  pattern: QRCodePattern;
  border: BorderFormatting;
  format: 'png' | 'jpg' | 'gif' | 'svg';
  dpi: number;
  scale: number;
  rotation: number;
}

export interface QRCodeLogo {
  enabled: boolean;
  source: string;
  size: number;
  position: 'center' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
  opacity: number;
  border: BorderFormatting;
  background: string;
  margin: number;
}

export interface QRCodePattern {
  type: 'square' | 'circle' | 'rounded' | 'diamond' | 'star' | 'custom';
  size: number;
  spacing: number;
  randomize: boolean;
  gradient: GradientFormatting;
  image: string;
}

export interface FieldConfiguration {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'email' | 'url' | 'phone' | 'password' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'file' | 'image' | 'hidden';
  value: any;
  placeholder: string;
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  hidden: boolean;
  validation: FieldValidation;
  formatting: FieldFormatting;
  options: FieldOption[];
  dependencies: FieldDependency[];
  events: FieldEvent[];
  help: FieldHelp;
  accessibility: FieldAccessibility;
}

export interface FieldValidation {
  required: boolean;
  minLength: number;
  maxLength: number;
  minValue: number;
  maxValue: number;
  pattern: string;
  customValidation: string;
  errorMessage: string;
  realTimeValidation: boolean;
  validateOnBlur: boolean;
  validateOnChange: boolean;
}

export interface FieldFormatting {
  mask: string;
  prefix: string;
  suffix: string;
  separator: string;
  decimal: string;
  precision: number;
  currency: string;
  locale: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'title';
}

export interface FieldOption {
  value: any;
  label: string;
  description: string;
  group: string;
  disabled: boolean;
  selected: boolean;
  icon: string;
  image: string;
  color: string;
}

export interface FieldDependency {
  field: string;
  condition: string;
  value: any;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'populate' | 'validate';
  parameters: any;
}

export interface FieldEvent {
  type: 'change' | 'blur' | 'focus' | 'click' | 'keyup' | 'keydown' | 'keypress' | 'input';
  handler: string;
  parameters: any;
  preventDefault: boolean;
  stopPropagation: boolean;
  debounce: number;
  throttle: number;
}

export interface FieldHelp {
  enabled: boolean;
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'tooltip' | 'popover';
  trigger: 'hover' | 'focus' | 'click' | 'manual';
  icon: string;
  color: string;
  placement: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  delay: number;
  duration: number;
}

export interface FieldAccessibility {
  label: string;
  description: string;
  required: boolean;
  error: string;
  hint: string;
  role: string;
  tabIndex: number;
  ariaLabel: string;
  ariaDescribedBy: string;
  ariaRequired: boolean;
  ariaInvalid: boolean;
}

export interface CalculationConfiguration {
  name: string;
  expression: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  format: string;
  dependencies: string[];
  scope: 'row' | 'group' | 'page' | 'report';
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'first' | 'last' | 'distinct' | 'none';
  reset: 'never' | 'page' | 'group' | 'report';
  initialValue: any;
  precision: number;
  rounding: 'round' | 'floor' | 'ceil' | 'trunc';
  validation: CalculationValidation;
  caching: boolean;
  lazy: boolean;
}

export interface CalculationValidation {
  enabled: boolean;
  minValue: number;
  maxValue: number;
  required: boolean;
  customValidation: string;
  errorMessage: string;
  warningMessage: string;
  informationMessage: string;
}

export interface SubreportConfiguration {
  name: string;
  source: string;
  parameters: SubreportParameter[];
  connection: string;
  datasource: string;
  caching: boolean;
  lazy: boolean;
  async: boolean;
  timeout: number;
  retries: number;
  fallback: string;
  error: SubreportError;
  layout: SubreportLayout;
}

export interface SubreportParameter {
  name: string;
  value: any;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue: any;
  expression: string;
  validation: string;
}

export interface SubreportError {
  handling: 'ignore' | 'show_message' | 'show_placeholder' | 'fail_report';
  message: string;
  placeholder: string;
  logging: boolean;
  notification: boolean;
}

export interface SubreportLayout {
  position: 'inline' | 'overlay' | 'new_page' | 'new_column';
  sizing: 'auto' | 'fixed' | 'stretch' | 'shrink';
  spacing: number;
  alignment: 'left' | 'center' | 'right' | 'justify';
  border: BorderFormatting;
  background: string;
  margin: PaddingFormatting;
  padding: PaddingFormatting;
}

export interface ComponentData {
  source: string;
  connection: string;
  query: string;
  parameters: DataParameter[];
  caching: DataCaching;
  transformation: DataTransformation;
  filtering: DataFiltering;
  sorting: DataSorting;
  grouping: DataGrouping;
  aggregation: DataAggregation;
  paging: DataPaging;
}

export interface DataParameter {
  name: string;
  value: any;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue: any;
  validation: string;
  transformation: string;
  sensitive: boolean;
  encrypted: boolean;
}

export interface DataCaching {
  enabled: boolean;
  strategy: 'memory' | 'disk' | 'distributed' | 'hybrid';
  ttl: number;
  maxSize: number;
  eviction: 'lru' | 'lfu' | 'fifo' | 'random';
  key: string;
  invalidation: string[];
  preload: boolean;
  compression: boolean;
}

export interface DataTransformation {
  enabled: boolean;
  rules: TransformationRule[];
  functions: TransformationFunction[];
  mapping: TransformationMapping[];
  validation: TransformationValidation[];
  error: TransformationError;
}

export interface TransformationFunction {
  name: string;
  expression: string;
  parameters: string[];
  returnType: string;
  description: string;
  category: string;
  examples: string[];
}

export interface TransformationMapping {
  source: string;
  target: string;
  transformation: string;
  condition: string;
  defaultValue: any;
  validation: string;
}

export interface TransformationValidation {
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  action: 'stop' | 'skip' | 'default' | 'continue';
}

export interface TransformationError {
  handling: 'stop' | 'skip' | 'default' | 'continue';
  logging: boolean;
  notification: boolean;
  fallback: any;
  retries: number;
  timeout: number;
}

export interface DataFiltering {
  enabled: boolean;
  filters: ReportFilter[];
  mode: 'and' | 'or' | 'custom';
  expression: string;
  caseSensitive: boolean;
  allowEmpty: boolean;
  defaultFilter: string;
}

export interface DataSorting {
  enabled: boolean;
  fields: SortField[];
  defaultSort: string;
  multiColumn: boolean;
  stable: boolean;
  nullsFirst: boolean;
  caseSensitive: boolean;
  locale: string;
}

export interface DataGrouping {
  enabled: boolean;
  fields: GroupingField[];
  mode: 'flat' | 'hierarchical' | 'nested';
  aggregation: boolean;
  sorting: boolean;
  totals: boolean;
  subtotals: boolean;
  grandTotal: boolean;
}

export interface GroupingField {
  field: string;
  level: number;
  sorting: 'ascending' | 'descending' | 'none';
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'first' | 'last' | 'distinct';
  format: string;
  header: boolean;
  footer: boolean;
  pageBreak: boolean;
  keepTogether: boolean;
}

export interface DataAggregation {
  enabled: boolean;
  functions: AggregationFunction[];
  groupBy: string[];
  having: string;
  window: WindowFunction;
  rollup: boolean;
  cube: boolean;
  groupingSets: string[][];
}

export interface DataPaging {
  enabled: boolean;
  pageSize: number;
  totalRecords: number;
  currentPage: number;
  serverSide: boolean;
  lazy: boolean;
  prefetch: boolean;
  caching: boolean;
}

export interface ComponentFormatting {
  border: BorderFormatting;
  background: BackgroundFormatting;
  padding: PaddingFormatting;
  margin: PaddingFormatting;
  shadow: ShadowFormatting;
  opacity: number;
  zIndex: number;
  transform: TransformFormatting;
  transition: TransitionFormatting;
  animation: AnimationFormatting;
}

export interface ShadowFormatting {
  enabled: boolean;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  inset: boolean;
}

export interface TransformFormatting {
  rotate: number;
  scale: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  translateX: number;
  translateY: number;
  origin: string;
  perspective: number;
}

export interface TransitionFormatting {
  enabled: boolean;
  property: string;
  duration: number;
  timing: string;
  delay: number;
}

export interface AnimationFormatting {
  enabled: boolean;
  name: string;
  duration: number;
  timing: string;
  delay: number;
  iteration: number;
  direction: string;
  fillMode: string;
  playState: string;
}

export interface ComponentInteraction {
  type: 'click' | 'double_click' | 'right_click' | 'hover' | 'focus' | 'blur' | 'key_press' | 'drag' | 'drop';
  action: 'navigate' | 'filter' | 'sort' | 'drill_down' | 'drill_through' | 'export' | 'print' | 'email' | 'custom';
  target: string;
  parameters: any;
  conditions: string[];
  confirmation: InteractionConfirmation;
  feedback: InteractionFeedback;
  tracking: InteractionTracking;
}

export interface InteractionConfirmation {
  enabled: boolean;
  message: string;
  title: string;
  confirmText: string;
  cancelText: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'question';
  icon: string;
  buttons: string[];
}

export interface InteractionFeedback {
  enabled: boolean;
  type: 'message' | 'toast' | 'notification' | 'modal' | 'redirect' | 'refresh';
  message: string;
  duration: number;
  position: string;
  style: string;
  dismissible: boolean;
  actions: string[];
}

export interface InteractionTracking {
  enabled: boolean;
  event: string;
  category: string;
  label: string;
  value: any;
  custom: any;
  userId: string;
  sessionId: string;
  timestamp: boolean;
}

export interface ComponentValidation {
  enabled: boolean;
  rules: ValidationRule[];
  messages: ValidationMessage[];
  timing: 'real_time' | 'on_blur' | 'on_submit' | 'manual';
  highlighting: ValidationHighlighting;
  summary: ValidationSummary;
}

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  field: string;
  rule: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  position: 'inline' | 'tooltip' | 'summary' | 'modal';
}

export interface ValidationHighlighting {
  enabled: boolean;
  color: string;
  style: 'border' | 'background' | 'outline' | 'glow';
  animation: boolean;
  duration: number;
  intensity: number;
}

export interface ValidationSummary {
  enabled: boolean;
  position: 'top' | 'bottom' | 'sidebar' | 'modal';
  grouping: boolean;
  filtering: boolean;
  sorting: boolean;
  export: boolean;
  print: boolean;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  value: any;
  scope: 'global' | 'page' | 'section' | 'component';
  expression: string;
  format: string;
  validation: string;
  description: string;
  category: string;
  required: boolean;
  defaultValue: any;
  options: VariableOption[];
}

export interface VariableOption {
  value: any;
  label: string;
  description: string;
  group: string;
  selected: boolean;
  disabled: boolean;
}

export interface TemplateFormatting {
  theme: string;
  colors: TemplateColors;
  fonts: TemplateFonts;
  spacing: TemplateSpacing;
  borders: TemplateBorders;
  shadows: TemplateShadows;
  effects: TemplateEffects;
  responsive: TemplateResponsive;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  custom: Record<string, string>;
}

export interface TemplateFonts {
  heading: FontDefinition;
  body: FontDefinition;
  caption: FontDefinition;
  code: FontDefinition;
  custom: Record<string, FontDefinition>;
}

export interface FontDefinition {
  family: string;
  weight: string;
  style: string;
  size: string;
  lineHeight: string;
  letterSpacing: string;
  wordSpacing: string;
  variants: FontVariant[];
  fallbacks: string[];
}

export interface FontVariant {
  weight: string;
  style: string;
  size: string;
  usage: string;
}

export interface TemplateSpacing {
  unit: 'px' | 'rem' | 'em' | '%' | 'pt';
  base: number;
  scale: number[];
  custom: Record<string, number>;
}

export interface TemplateBorders {
  width: number;
  style: string;
  color: string;
  radius: number;
  custom: Record<string, BorderDefinition>;
}

export interface BorderDefinition {
  width: number;
  style: string;
  color: string;
  radius: number;
}

export interface TemplateShadows {
  small: string;
  medium: string;
  large: string;
  custom: Record<string, string>;
}

export interface TemplateEffects {
  transitions: TransitionEffect[];
  animations: AnimationEffect[];
  filters: FilterEffect[];
  transforms: TransformEffect[];
}

export interface TransitionEffect {
  name: string;
  property: string;
  duration: string;
  timing: string;
  delay: string;
}

export interface AnimationEffect {
  name: string;
  keyframes: string;
  duration: string;
  timing: string;
  delay: string;
  iteration: string;
  direction: string;
  fillMode: string;
}

export interface FilterEffect {
  name: string;
  filter: string;
  value: string;
}

export interface TransformEffect {
  name: string;
  transform: string;
  origin: string;
}

export interface TemplateResponsive {
  enabled: boolean;
  breakpoints: ResponsiveBreakpoint[];
  adaptationStrategy: 'mobile_first' | 'desktop_first' | 'adaptive';
  units: 'px' | 'em' | 'rem' | '%' | 'vw' | 'vh';
  grid: ResponsiveGrid;
  typography: ResponsiveTypography;
  spacing: ResponsiveSpacing;
  layout: ResponsiveLayout;
}

export interface ResponsiveGrid {
  enabled: boolean;
  columns: number;
  gutter: number;
  maxWidth: number;
  breakpoints: GridBreakpoint[];
}

export interface GridBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  columns: number;
  gutter: number;
  margins: number;
}

export interface ResponsiveTypography {
  enabled: boolean;
  scaling: 'linear' | 'modular' | 'custom';
  ratio: number;
  minSize: number;
  maxSize: number;
  breakpoints: TypographyBreakpoint[];
}

export interface TypographyBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface ResponsiveSpacing {
  enabled: boolean;
  scaling: 'linear' | 'exponential' | 'custom';
  base: number;
  ratio: number;
  breakpoints: SpacingBreakpoint[];
}

export interface SpacingBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  base: number;
  scale: number[];
}

export interface ResponsiveLayout {
  enabled: boolean;
  strategy: 'stack' | 'reflow' | 'hide' | 'collapse';
  breakpoints: LayoutBreakpoint[];
  navigation: ResponsiveNavigation;
  images: ResponsiveImages;
  tables: ResponsiveTables;
}

export interface LayoutBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  columns: number;
  layout: string;
  visibility: string[];
  ordering: string[];
}

export interface ResponsiveNavigation {
  enabled: boolean;
  breakpoint: number;
  style: 'hamburger' | 'accordion' | 'tabs' | 'dropdown';
  position: 'top' | 'bottom' | 'left' | 'right';
  overlay: boolean;
  animation: string;
}

export interface ResponsiveImages {
  enabled: boolean;
  strategy: 'fluid' | 'adaptive' | 'art_direction';
  breakpoints: ImageBreakpoint[];
  loading: 'lazy' | 'eager' | 'auto';
  formats: string[];
  quality: number[];
}

export interface ImageBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  width: number;
  height: number;
  quality: number;
  format: string;
}

export interface ResponsiveTables {
  enabled: boolean;
  strategy: 'scroll' | 'stack' | 'collapse' | 'priority';
  breakpoint: number;
  priority: string[];
  labels: boolean;
  headers: boolean;
}

export interface TemplateBranding {
  enabled: boolean;
  logo: BrandingLogo;
  colors: BrandingColors;
  typography: BrandingTypography;
  spacing: BrandingSpacing;
  elements: BrandingElement[];
  guidelines: BrandingGuidelines;
}

export interface BrandingLogo {
  enabled: boolean;
  source: string;
  position: 'header' | 'footer' | 'watermark' | 'background';
  size: 'small' | 'medium' | 'large' | 'custom';
  alignment: 'left' | 'center' | 'right';
  opacity: number;
  margin: PaddingFormatting;
  link: string;
  alt: string;
}

export interface BrandingColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  complementary: string[];
  gradient: GradientFormatting;
  usage: ColorUsage;
}

export interface ColorUsage {
  headers: string;
  text: string;
  background: string;
  borders: string;
  accents: string;
  links: string;
  buttons: string;
  highlights: string;
}

export interface BrandingTypography {
  primary: FontDefinition;
  secondary: FontDefinition;
  accent: FontDefinition;
  hierarchy: TypographyHierarchy;
  guidelines: TypographyGuidelines;
}

export interface TypographyHierarchy {
  h1: FontDefinition;
  h2: FontDefinition;
  h3: FontDefinition;
  h4: FontDefinition;
  h5: FontDefinition;
  h6: FontDefinition;
  body: FontDefinition;
  caption: FontDefinition;
  small: FontDefinition;
}

export interface TypographyGuidelines {
  minSize: number;
  maxSize: number;
  scale: number;
  contrast: number;
  spacing: number;
  alignment: string;
  usage: string[];
}

export interface BrandingSpacing {
  unit: string;
  base: number;
  scale: number[];
  rhythm: number;
  grid: number;
  margins: PaddingFormatting;
  padding: PaddingFormatting;
}

export interface BrandingElement {
  type: 'shape' | 'pattern' | 'texture' | 'icon' | 'illustration' | 'decoration';
  name: string;
  source: string;
  usage: string[];
  position: string[];
  size: string[];
  color: string[];
  opacity: number;
  rotation: number;
  scale: number;
}

export interface BrandingGuidelines {
  document: string;
  version: string;
  approved: boolean;
  approver: string;
  approvalDate: Date;
  restrictions: string[];
  permissions: string[];
  compliance: string[];
  usage: string[];
}

export interface TemplateLocalization {
  enabled: boolean;
  languages: LanguageDefinition[];
  defaultLanguage: string;
  fallbackLanguage: string;
  direction: 'ltr' | 'rtl' | 'auto';
  formats: LocalizationFormat[];
  resources: LocalizationResource[];
  pluralization: LocalizationPluralization;
  interpolation: LocalizationInterpolation;
  namespaces: LocalizationNamespace[];
}

export interface LanguageDefinition {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  script: string;
  direction: 'ltr' | 'rtl';
  pluralRule: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  currencyFormat: string;
  percentFormat: string;
  enabled: boolean;
  fallback: string;
}

export interface LocalizationFormat {
  type: 'date' | 'time' | 'number' | 'currency' | 'percent' | 'relative' | 'list' | 'custom';
  pattern: string;
  locale: string;
  options: any;
  examples: string[];
}

export interface LocalizationResource {
  language: string;
  namespace: string;
  key: string;
  value: string;
  context: string;
  plurals: Record<string, string>;
  interpolations: string[];
  description: string;
  translator: string;
  translationDate: Date;
  approved: boolean;
  approver: string;
  approvalDate: Date;
}

export interface LocalizationPluralization {
  enabled: boolean;
  rules: PluralizationRule[];
  fallback: string;
  separator: string;
  keyGenerator: string;
}

export interface PluralizationRule {
  language: string;
  rule: string;
  categories: string[];
  examples: Record<string, number[]>;
}

export interface LocalizationInterpolation {
  enabled: boolean;
  prefix: string;
  suffix: string;
  escape: boolean;
  format: boolean;
  functions: InterpolationFunction[];
}

export interface InterpolationFunction {
  name: string;
  description: string;
  parameters: string[];
  examples: string[];
  implementation: string;
}

export interface LocalizationNamespace {
  name: string;
  description: string;
  languages: string[];
  resources: number;
  completion: number;
  lastUpdated: Date;
  maintainer: string;
  priority: 'low' | 'medium' | 'high';
}

export interface TemplateValidation {
  enabled: boolean;
  rules: TemplateValidationRule[];
  severity: 'error' | 'warning' | 'info';
  scope: 'compile' | 'runtime' | 'both';
  reporting: ValidationReporting;
  correction: ValidationCorrection;
}

export interface TemplateValidationRule {
  name: string;
  description: string;
  type: 'syntax' | 'semantic' | 'performance' | 'accessibility' | 'security' | 'branding';
  condition: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fix: string;
  examples: string[];
  enabled: boolean;
}

export interface ValidationReporting {
  enabled: boolean;
  format: 'console' | 'file' | 'database' | 'email' | 'webhook';
  destination: string;
  grouping: boolean;
  filtering: boolean;
  sorting: boolean;
  summary: boolean;
  details: boolean;
}

export interface ValidationCorrection {
  enabled: boolean;
  automatic: boolean;
  suggestions: boolean;
  preview: boolean;
  confirmation: boolean;
  backup: boolean;
  logging: boolean;
}

export interface ReportDataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'web_service' | 'cloud' | 'data_warehouse' | 'stream';
  connection: DataConnection;
  schema: DataSchema;
  security: DataSourceSecurity;
  performance: DataSourcePerformance;
  monitoring: DataSourceMonitoring;
  metadata: DataSourceMetadata;
}

export interface DataConnection {
  type: 'sql' | 'nosql' | 'rest' | 'graphql' | 'soap' | 'odata' | 'file' | 'ftp' | 'sftp' | 'cloud_storage';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  connectionString: string;
  ssl: boolean;
  timeout: number;
  retries: number;
  pooling: ConnectionPooling;
  encryption: ConnectionEncryption;
  proxy: ConnectionProxy;
  authentication: ConnectionAuthentication;
  headers: Record<string, string>;
  parameters: Record<string, any>;
}

export interface ConnectionPooling {
  enabled: boolean;
  minSize: number;
  maxSize: number;
  idleTimeout: number;
  maxLifetime: number;
  testOnBorrow: boolean;
  testOnReturn: boolean;
  testWhileIdle: boolean;
  validationQuery: string;
}

export interface ConnectionEncryption {
  enabled: boolean;
  protocol: 'tls' | 'ssl' | 'dtls';
  version: string;
  cipherSuites: string[];
  keyStore: string;
  keyStorePassword: string;
  trustStore: string;
  trustStorePassword: string;
  clientAuth: boolean;
  hostnameVerification: boolean;
}

export interface ConnectionProxy {
  enabled: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
  type: 'http' | 'https' | 'socks4' | 'socks5';
  nonProxyHosts: string[];
}

export interface ConnectionAuthentication {
  type: 'basic' | 'digest' | 'ntlm' | 'kerberos' | 'oauth' | 'api_key' | 'certificate' | 'custom';
  username: string;
  password: string;
  domain: string;
  token: string;
  apiKey: string;
  certificate: string;
  privateKey: string;
  customHeaders: Record<string, string>;
  customParameters: Record<string, any>;
}

export interface DataSchema {
  tables: SchemaTable[];
  views: SchemaView[];
  procedures: SchemaProcedure[];
  functions: SchemaFunction[];
  relationships: SchemaRelationship[];
  constraints: SchemaConstraint[];
  indexes: SchemaIndex[];
  metadata: SchemaMetadata;
}

export interface SchemaTable {
  name: string;
  schema: string;
  columns: SchemaColumn[];
  primaryKey: string[];
  foreignKeys: SchemaForeignKey[];
  constraints: SchemaConstraint[];
  indexes: SchemaIndex[];
  triggers: SchemaTrigger[];
  statistics: TableStatistics;
  metadata: TableMetadata;
}

export interface SchemaColumn {
  name: string;
  type: string;
  size: number;
  precision: number;
  scale: number;
  nullable: boolean;
  defaultValue: any;
  autoIncrement: boolean;
  description: string;
  constraints: string[];
  statistics: ColumnStatistics;
  metadata: ColumnMetadata;
}

export interface SchemaForeignKey {
  name: string;
  columns: string[];
  referencedTable: string;
  referencedColumns: string[];
  onUpdate: 'cascade' | 'restrict' | 'set_null' | 'set_default' | 'no_action';
  onDelete: 'cascade' | 'restrict' | 'set_null' | 'set_default' | 'no_action';
  deferrable: boolean;
  initially: 'deferred' | 'immediate';
}

export interface SchemaConstraint {
  name: string;
  type: 'primary_key' | 'foreign_key' | 'unique' | 'check' | 'not_null' | 'default' | 'exclusion';
  columns: string[];
  definition: string;
  enabled: boolean;
  deferrable: boolean;
  initially: 'deferred' | 'immediate';
}

export interface SchemaIndex {
  name: string;
  type: 'btree' | 'hash' | 'gist' | 'gin' | 'spgist' | 'brin' | 'bitmap' | 'clustered' | 'non_clustered';
  columns: IndexColumn[];
  unique: boolean;
  partial: boolean;
  condition: string;
  tablespace: string;
  statistics: IndexStatistics;
  metadata: IndexMetadata;
}

export interface IndexColumn {
  name: string;
  order: 'asc' | 'desc';
  nulls: 'first' | 'last';
  operator: string;
  collation: string;
  expression: string;
}

export interface SchemaTrigger {
  name: string;
  timing: 'before' | 'after' | 'instead_of';
  events: string[];
  orientation: 'row' | 'statement';
  condition: string;
  procedure: string;
  enabled: boolean;
  metadata: TriggerMetadata;
}

export interface TriggerMetadata {
  description: string;
  owner: string;
  created: Date;
  modified: Date;
  version: string;
  dependencies: string[];
  source: string;
}

export interface TableStatistics {
  rowCount: number;
  size: number;
  averageRowSize: number;
  indexSize: number;
  compressionRatio: number;
  lastUpdated: Date;
  lastAnalyzed: Date;
  growth: TableGrowth;
}

export interface TableGrowth {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  prediction: GrowthPrediction;
}

export interface GrowthPrediction {
  nextMonth: number;
  nextQuarter: number;
  nextYear: number;
  confidence: number;
  method: string;
}

export interface TableMetadata {
  description: string;
  owner: string;
  created: Date;
  modified: Date;
  version: string;
  tags: string[];
  categories: string[];
  steward: string;
  classification: string;
  sensitivity: string;
  retention: number;
  backup: boolean;
  archived: boolean;
}

export interface ColumnStatistics {
  distinctValues: number;
  nullValues: number;
  minValue: any;
  maxValue: any;
  averageValue: any;
  medianValue: any;
  mode: any;
  standardDeviation: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  distribution: ValueDistribution;
  patterns: DataPattern[];
}

export interface ValueDistribution {
  type: 'normal' | 'uniform' | 'exponential' | 'poisson' | 'binomial' | 'unknown';
  parameters: any;
  histogram: DistributionBin[];
  percentiles: Record<string, number>;
}

export interface DistributionBin {
  range: [any, any];
  count: number;
  frequency: number;
  density: number;
}

export interface DataPattern {
  type: 'format' | 'length' | 'range' | 'frequency' | 'sequence' | 'correlation';
  pattern: string;
  frequency: number;
  confidence: number;
  examples: any[];
}

export interface ColumnMetadata {
  description: string;
  businessName: string;
  dataType: string;
  format: string;
  unit: string;
  precision: number;
  scale: number;
  encoding: string;
  classification: string;
  sensitivity: string;
  pii: boolean;
  phi: boolean;
  financialData: boolean;
  derivedFrom: string[];
  usedBy: string[];
  quality: DataQuality;
  lineage: DataLineage;
}

export interface SchemaView {
  name: string;
  schema: string;
  definition: string;
  columns: SchemaColumn[];
  dependencies: string[];
  materialized: boolean;
  updatable: boolean;
  statistics: ViewStatistics;
  metadata: ViewMetadata;
}

export interface ViewStatistics {
  rowCount: number;
  size: number;
  lastRefreshed: Date;
  refreshFrequency: string;
  usage: ViewUsage;
  performance: ViewPerformance;
}

export interface ViewUsage {
  queries: number;
  users: number;
  applications: string[];
  lastUsed: Date;
  frequency: number;
  peakUsage: number;
}

export interface ViewPerformance {
  averageQueryTime: number;
  slowestQuery: number;
  fastestQuery: number;
  queryCount: number;
  errorRate: number;
  optimization: string[];
}

export interface ViewMetadata {
  description: string;
  owner: string;
  created: Date;
  modified: Date;
  version: string;
  purpose: string;
  businessRules: string[];
  dataSource: string[];
  refreshSchedule: string;
  dependencies: string[];
  consumers: string[];
}

export interface SchemaProcedure {
  name: string;
  schema: string;
  parameters: ProcedureParameter[];
  returnType: string;
  body: string;
  language: string;
  deterministic: boolean;
  security: 'definer' | 'invoker';
  metadata: ProcedureMetadata;
}

export interface ProcedureParameter {
  name: string;
  type: string;
  mode: 'in' | 'out' | 'inout';
  defaultValue: any;
  description: string;
}

export interface ProcedureMetadata {
  description: string;
  owner: string;
  created: Date;
  modified: Date;
  version: string;
  purpose: string;
  dependencies: string[];
  consumers: string[];
  performance: ProcedurePerformance;
}

export interface ProcedurePerformance {
  averageExecutionTime: number;
  maxExecutionTime: number;
  minExecutionTime: number;
  executionCount: number;
  errorRate: number;
  lastExecuted: Date;
}

export interface SchemaFunction {
  name: string;
  schema: string;
  parameters: FunctionParameter[];
  returnType: string;
  body: string;
  language: string;
  deterministic: boolean;
  immutable: boolean;
  security: 'definer' | 'invoker';
  metadata: FunctionMetadata;
}

export interface FunctionParameter {
  name: string;
  type: string;
  defaultValue: any;
  description: string;
}

export interface FunctionMetadata {
  description: string;
  owner: string;
  created: Date;
  modified: Date;
  version: string;
  purpose: string;
  dependencies: string[];
  consumers: string[];
  performance: FunctionPerformance;
}

export interface FunctionPerformance {
  averageExecutionTime: number;
  maxExecutionTime: number;
  minExecutionTime: number;
  executionCount: number;
  errorRate: number;
  lastExecuted: Date;
}

export interface SchemaRelationship {
  name: string;
  type: 'one_to_one' | 'one_to_many' | 'many_to_one' | 'many_to_many';
  parentTable: string;
  parentColumns: string[];
  childTable: string;
  childColumns: string[];
  cardinality: RelationshipCardinality;
  integrity: RelationshipIntegrity;
  metadata: RelationshipMetadata;
}

export interface RelationshipCardinality {
  minimum: number;
  maximum: number;
  average: number;
  distribution: any;
}

export interface RelationshipIntegrity {
  enforced: boolean;
  violations: number;
  lastChecked: Date;
  checkFrequency: string;
  autoFix: boolean;
}

export interface RelationshipMetadata {
  description: string;
  businessRule: string;
  created: Date;
  modified: Date;
  owner: string;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
}

export interface SchemaMetadata {
  version: string;
  database: string;
  schema: string;
  description: string;
  owner: string;
  created: Date;
  modified: Date;
  size: number;
  objects: number;
  documentation: string;
  changelog: SchemaChange[];
}

export interface SchemaChange {
  version: string;
  date: Date;
  author: string;
  description: string;
  type: 'create' | 'alter' | 'drop' | 'rename' | 'migrate';
  object: string;
  sql: string;
  rollback: string;
  tested: boolean;
  approved: boolean;
}

export interface DataSourceSecurity {
  authentication: DataSourceAuthentication;
  authorization: DataSourceAuthorization;
  encryption: DataSourceEncryption;
  auditing: DataSourceAuditing;
  masking: DataSourceMasking;
  compliance: DataSourceCompliance;
}

export interface DataSourceAuthentication {
  type: 'database' | 'integrated' | 'kerberos' | 'oauth' | 'certificate' | 'custom';
  username: string;
  password: string;
  domain: string;
  token: string;
  certificate: string;
  privateKey: string;
  mfa: boolean;
  sso: boolean;
  session: SessionConfig;
}

export interface SessionConfig {
  timeout: number;
  renewal: boolean;
  tracking: boolean;
  concurrent: number;
  persistence: boolean;
}

export interface DataSourceAuthorization {
  enabled: boolean;
  model: 'rbac' | 'abac' | 'dac' | 'mac';
  roles: DataSourceRole[];
  permissions: DataSourcePermission[];
  policies: DataSourcePolicy[];
  inheritance: boolean;
  delegation: boolean;
}

export interface DataSourceRole {
  name: string;
  description: string;
  permissions: string[];
  users: string[];
  groups: string[];
  constraints: string[];
  inheritance: boolean;
  delegation: boolean;
}

export interface DataSourcePermission {
  name: string;
  description: string;
  type: 'read' | 'write' | 'execute' | 'admin' | 'custom';
  scope: 'database' | 'schema' | 'table' | 'column' | 'row' | 'procedure' | 'function';
  object: string;
  conditions: string[];
  granted: boolean;
  grantable: boolean;
}

export interface DataSourcePolicy {
  name: string;
  description: string;
  type: 'access' | 'data' | 'time' | 'location' | 'device' | 'custom';
  rules: PolicyRule[];
  enforcement: 'advisory' | 'blocking' | 'logging';
  priority: number;
  enabled: boolean;
}

export interface DataSourceEncryption {
  enabled: boolean;
  inTransit: boolean;
  atRest: boolean;
  algorithm: 'aes' | 'des' | 'rsa' | 'ecc' | 'custom';
  keySize: number;
  keyManagement: 'internal' | 'external' | 'hsm' | 'cloud';
  rotation: boolean;
  rotationInterval: number;
}

export interface DataSourceAuditing {
  enabled: boolean;
  events: string[];
  storage: 'database' | 'file' | 'siem' | 'cloud';
  retention: number;
  compression: boolean;
  encryption: boolean;
  analysis: boolean;
  reporting: boolean;
  realTime: boolean;
}

export interface DataSourceMasking {
  enabled: boolean;
  strategy: 'static' | 'dynamic' | 'format_preserving' | 'tokenization';
  rules: MaskingRule[];
  algorithms: MaskingAlgorithm[];
  consistency: boolean;
  reversibility: boolean;
  testing: boolean;
}

export interface MaskingAlgorithm {
  name: string;
  type: 'substitution' | 'shuffling' | 'nulling' | 'variance' | 'encryption' | 'hashing';
  parameters: any;
  reversible: boolean;
  consistency: boolean;
  performance: AlgorithmPerformance;
}

export interface AlgorithmPerformance {
  speed: number;
  memory: number;
  cpu: number;
  scalability: number;
  accuracy: number;
}

export interface DataSourceCompliance {
  enabled: boolean;
  frameworks: string[];
  requirements: ComplianceRequirement[];
  controls: ComplianceControl[];
  assessments: ComplianceAssessment[];
  reporting: ComplianceReporting;
  monitoring: ComplianceMonitoring;
}

export interface ComplianceMonitoring {
  enabled: boolean;
  frequency: string;
  automated: boolean;
  alerts: boolean;
  dashboard: boolean;
  reporting: boolean;
  remediation: boolean;
}

export interface DataSourcePerformance {
  monitoring: PerformanceMonitoring;
  optimization: PerformanceOptimization;
  caching: PerformanceCaching;
  pooling: PerformancePooling;
  clustering: PerformanceClustering;
  scaling: PerformanceScaling;
}

export interface PerformanceMonitoring {
  enabled: boolean;
  metrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  dashboard: string;
  reporting: boolean;
  profiling: boolean;
  tracing: boolean;
}

export interface PerformanceMetric {
  name: string;
  type: 'gauge' | 'counter' | 'histogram' | 'summary';
  unit: string;
  description: string;
  threshold: number;
  target: number;
  current: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PerformanceAlert {
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recipients: string[];
  actions: string[];
  enabled: boolean;
}

export interface PerformanceOptimization {
  enabled: boolean;
  automatic: boolean;
  techniques: string[];
  rules: OptimizationRule[];
  scheduling: OptimizationScheduling;
  monitoring: OptimizationMonitoring;
}

export interface OptimizationRule {
  name: string;
  description: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
  impact: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
}

export interface OptimizationScheduling {
  enabled: boolean;
  frequency: string;
  time: string;
  maintenance: boolean;
  impact: 'low' | 'medium' | 'high';
  rollback: boolean;
}

export interface OptimizationMonitoring {
  enabled: boolean;
  before: boolean;
  after: boolean;
  comparison: boolean;
  reporting: boolean;
  alerts: boolean;
}

export interface PerformanceCaching {
  enabled: boolean;
  type: 'memory' | 'disk' | 'distributed' | 'hybrid';
  size: number;
  ttl: number;
  eviction: 'lru' | 'lfu' | 'fifo' | 'random';
  compression: boolean;
  encryption: boolean;
  monitoring: CacheMonitoring;
}

export interface CacheMonitoring {
  enabled: boolean;
  hitRate: boolean;
  missRate: boolean;
  evictions: boolean;
  size: boolean;
  performance: boolean;
  alerts: boolean;
}

export interface PerformancePooling {
  enabled: boolean;
  type: 'connection' | 'thread' | 'object' | 'resource';
  minSize: number;
  maxSize: number;
  initialSize: number;
  increment: number;
  timeout: number;
  validation: boolean;
  monitoring: PoolingMonitoring;
}

export interface PoolingMonitoring {
  enabled: boolean;
  active: boolean;
  idle: boolean;
  waiting: boolean;
  errors: boolean;
  performance: boolean;
  alerts: boolean;
}

export interface PerformanceClustering {
  enabled: boolean;
  type: 'active_active' | 'active_passive' | 'master_slave' | 'peer_to_peer';
  nodes: ClusterNode[];
  loadBalancing: ClusterLoadBalancing;
  failover: ClusterFailover;
  monitoring: ClusterMonitoring;
}

export interface ClusterNode {
  id: string;
  host: string;
  port: number;
  weight: number;
  status: 'active' | 'standby' | 'failed' | 'maintenance';
  role: 'master' | 'slave' | 'peer' | 'arbiter';
  resources: NodeResources;
  performance: NodePerformance;
}

export interface NodePerformance {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  connections: number;
  transactions: number;
  errors: number;
  response_time: number;
}

export interface ClusterLoadBalancing {
  algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'ip_hash' | 'least_response_time';
  sticky: boolean;
  health_check: boolean;
  failover: boolean;
  monitoring: boolean;
}

export interface ClusterFailover {
  enabled: boolean;
  automatic: boolean;
  detection: 'heartbeat' | 'polling' | 'monitoring';
  timeout: number;
  retries: number;
  notification: boolean;
  rollback: boolean;
}

export interface ClusterMonitoring {
  enabled: boolean;
  nodes: boolean;
  connections: boolean;
  performance: boolean;
  health: boolean;
  alerts: boolean;
  dashboard: boolean;
}

export interface PerformanceScaling {
  enabled: boolean;
  type: 'horizontal' | 'vertical' | 'auto';
  triggers: ScalingTrigger[];
  policies: ScalingPolicy[];
  limits: ScalingLimits;
  monitoring: ScalingMonitoring;
}

export interface ScalingTrigger {
  metric: string;
  threshold: number;
  duration: number;
  action: 'scale_up' | 'scale_down' | 'scale_out' | 'scale_in';
  cooldown: number;
  enabled: boolean;
}

export interface ScalingLimits {
  minInstances: number;
  maxInstances: number;
  minResources: ResourceLimits;
  maxResources: ResourceLimits;
  cost: number;
  budget: number;
}

export interface ResourceLimits {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface ScalingMonitoring {
  enabled: boolean;
  triggers: boolean;
  actions: boolean;
  performance: boolean;
  cost: boolean;
  alerts: boolean;
  reporting: boolean;
}

export interface DataSourceMonitoring {
  enabled: boolean;
  health: HealthMonitoring;
  performance: PerformanceMonitoring;
  security: SecurityMonitoring;
  usage: UsageMonitoring;
  alerts: AlertMonitoring;
  reporting: ReportingMonitoring;
}

export interface HealthMonitoring {
  enabled: boolean;
  checks: HealthCheck[];
  frequency: number;
  timeout: number;
  retries: number;
  alerts: boolean;
  recovery: boolean;
}

export interface SecurityMonitoring {
  enabled: boolean;
  authentication: boolean;
  authorization: boolean;
  access: boolean;
  threats: boolean;
  vulnerabilities: boolean;
  compliance: boolean;
  alerts: boolean;
}

export interface UsageMonitoring {
  enabled: boolean;
  connections: boolean;
  transactions: boolean;
  queries: boolean;
  resources: boolean;
  patterns: boolean;
  trends: boolean;
  forecasting: boolean;
}

export interface AlertMonitoring {
  enabled: boolean;
  rules: AlertRule[];
  channels: AlertChannel[];
  escalation: AlertEscalation;
  suppression: AlertSuppression;
  correlation: AlertCorrelation;
}

export interface AlertChannel {
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'pager' | 'dashboard';
  configuration: any;
  filters: string[];
  formatting: string;
  rate_limit: number;
  enabled: boolean;
}

export interface AlertCorrelation {
  enabled: boolean;
  window: number;
  threshold: number;
  grouping: string[];
  deduplication: boolean;
  enrichment: boolean;
}

export interface ReportingMonitoring {
  enabled: boolean;
  frequency: string;
  recipients: string[];
  format: 'html' | 'pdf' | 'csv' | 'json';
  content: string[];
  customization: boolean;
  automation: boolean;
}

export interface DataSourceMetadata {
  description: string;
  owner: string;
  steward: string;
  created: Date;
  modified: Date;
  version: string;
  environment: 'development' | 'test' | 'staging' | 'production';
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
  retention: number;
  backup: boolean;
  archive: boolean;
  tags: string[];
  categories: string[];
  documentation: string;
  contacts: Contact[];
  sla: ServiceLevelAgreement;
  dependencies: string[];
  consumers: string[];
  lineage: DataLineage;
  quality: DataQuality;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'steward' | 'admin' | 'user' | 'support';
  primary: boolean;
  notifications: boolean;
}

export interface ServiceLevelAgreement {
  availability: number;
  performance: number;
  reliability: number;
  security: number;
  support: SupportLevel;
  penalties: Penalty[];
  reporting: boolean;
  monitoring: boolean;
}

export interface SupportLevel {
  level: '24x7' | 'business_hours' | 'best_effort' | 'none';
  response: number;
  resolution: number;
  escalation: boolean;
  contacts: string[];
}

export interface Penalty {
  metric: string;
  threshold: number;
  penalty: number;
  type: 'financial' | 'service_credit' | 'performance_improvement';
  description: string;
}

export interface ReportParameter {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'list' | 'multi_list' | 'range' | 'cascading';
  dataType: 'text' | 'integer' | 'decimal' | 'datetime' | 'date' | 'time' | 'boolean' | 'enum' | 'json';
  required: boolean;
  hidden: boolean;
  defaultValue: any;
  prompt: string;
  helpText: string;
  validation: ParameterValidation;
  values: ParameterValue[];
  dependencies: ParameterDependency[];
  formatting: ParameterFormatting;
  behavior: ParameterBehavior;
  metadata: ParameterMetadata;
}

export interface ParameterValidation {
  required: boolean;
  minLength: number;
  maxLength: number;
  minValue: number;
  maxValue: number;
  pattern: string;
  customValidation: string;
  errorMessage: string;
  warningMessage: string;
  informationMessage: string;
}

export interface ParameterValue {
  value: any;
  label: string;
  description: string;
  group: string;
  order: number;
  selected: boolean;
  enabled: boolean;
  visible: boolean;
  condition: string;
  metadata: any;
}

export interface ParameterDependency {
  parameter: string;
  condition: string;
  value: any;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'populate' | 'filter' | 'validate';
  target: string;
  expression: string;
  cascading: boolean;
}

export interface ParameterFormatting {
  input: InputFormatting;
  display: DisplayFormatting;
  validation: ValidationFormatting;
  hint: HintFormatting;
}

export interface InputFormatting {
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime' | 'number' | 'range' | 'file' | 'color' | 'custom';
  size: 'small' | 'medium' | 'large' | 'auto';
  placeholder: string;
  mask: string;
  autocomplete: boolean;
  suggestions: string[];
  validation: boolean;
  formatting: boolean;
  readonly: boolean;
  disabled: boolean;
}

export interface DisplayFormatting {
  label: LabelFormatting;
  control: ControlFormatting;
  layout: LayoutFormatting;
  grouping: GroupingFormatting;
  conditional: ConditionalFormatting[];
}

export interface LabelFormatting {
  position: 'top' | 'left' | 'right' | 'bottom' | 'inline' | 'floating';
  alignment: 'left' | 'center' | 'right';
  width: number;
  font: FontFormatting;
  color: string;
  required: RequiredFormatting;
  help: HelpFormatting;
}

export interface RequiredFormatting {
  indicator: string;
  position: 'before' | 'after' | 'inline';
  color: string;
  font: FontFormatting;
}

export interface HelpFormatting {
  type: 'tooltip' | 'popover' | 'modal' | 'inline' | 'sidebar';
  trigger: 'hover' | 'click' | 'focus' | 'always';
  position: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  icon: string;
  color: string;
  size: number;
}

export interface ControlFormatting {
  width: number;
  height: number;
  border: BorderFormatting;
  background: string;
  padding: PaddingFormatting;
  margin: PaddingFormatting;
  font: FontFormatting;
  color: string;
  focus: FocusFormatting;
  hover: HoverFormatting;
  disabled: DisabledFormatting;
}

export interface FocusFormatting {
  border: BorderFormatting;
  background: string;
  shadow: string;
  outline: string;
}

export interface HoverFormatting {
  border: BorderFormatting;
  background: string;
  color: string;
  cursor: string;
}

export interface DisabledFormatting {
  border: BorderFormatting;
  background: string;
  color: string;
  opacity: number;
  cursor: string;
}

export interface LayoutFormatting {
  orientation: 'horizontal' | 'vertical';
  alignment: 'left' | 'center' | 'right' | 'justify';
  spacing: number;
  wrapping: boolean;
  columns: number;
  responsive: boolean;
  breakpoints: LayoutBreakpoint[];
}

export interface GroupingFormatting {
  enabled: boolean;
  title: string;
  collapsible: boolean;
  collapsed: boolean;
  border: BorderFormatting;
  background: string;
  padding: PaddingFormatting;
  margin: PaddingFormatting;
  font: FontFormatting;
}

export interface ConditionalFormatting {
  condition: string;
  formatting: any;
  priority: number;
  enabled: boolean;
}

export interface ValidationFormatting {
  position: 'inline' | 'tooltip' | 'popover' | 'modal' | 'summary';
  icon: string;
  color: string;
  font: FontFormatting;
  border: BorderFormatting;
  background: string;
  animation: boolean;
  duration: number;
}

export interface HintFormatting {
  position: 'below' | 'above' | 'inline' | 'tooltip' | 'popover';
  font: FontFormatting;
  color: string;
  icon: string;
  animation: boolean;
  duration: number;
}

export interface ParameterBehavior {
  autoSubmit: boolean;
  debounce: number;
  throttle: number;
  caching: boolean;
  persistence: boolean;
  reset: boolean;
  clear: boolean;
  history: boolean;
  suggestions: boolean;
  autocomplete: boolean;
  search: boolean;
  filtering: boolean;
  sorting: boolean;
  grouping: boolean;
  paging: boolean;
  lazy: boolean;
  async: boolean;
  validation: ValidationBehavior;
  events: EventBehavior[];
}

export interface ValidationBehavior {
  timing: 'immediate' | 'on_change' | 'on_blur' | 'on_submit' | 'manual';
  debounce: number;
  async: boolean;
  cache: boolean;
  feedback: 'immediate' | 'delayed' | 'on_submit';
  severity: 'error' | 'warning' | 'info';
  blocking: boolean;
  highlighting: boolean;
  summary: boolean;
}

export interface EventBehavior {
  type: 'change' | 'blur' | 'focus' | 'click' | 'submit' | 'reset' | 'custom';
  handler: string;
  async: boolean;
  debounce: number;
  throttle: number;
  preventDefault: boolean;
  stopPropagation: boolean;
  confirmation: boolean;
  validation: boolean;
  tracking: boolean;
}

export interface ParameterMetadata {
  description: string;
  purpose: string;
  businessRule: string;
  defaultBehavior: string;
  examples: string[];
  notes: string;
  version: string;
  author: string;
  created: Date;
  modified: Date;
  tags: string[];
  categories: string[];
  related: string[];
  dependencies: string[];
  consumers: string[];
  testing: TestingMetadata;
  performance: PerformanceMetadata;
}

export interface TestingMetadata {
  testCases: TestCase[];
  coverage: number;
  lastTested: Date;
  automated: boolean;
  results: TestResult[];
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  input: any;
  expected: any;
  actual: any;
  status: 'pass' | 'fail' | 'skip' | 'error';
  duration: number;
  timestamp: Date;
}

export interface TestResult {
  id: string;
  testCase: string;
  status: 'pass' | 'fail' | 'skip' | 'error';
  message: string;
  duration: number;
  timestamp: Date;
  environment: string;
  version: string;
}

export interface PerformanceMetadata {
  responseTime: number;
  throughput: number;
  memory: number;
  cpu: number;
  network: number;
  cacheHitRate: number;
  errorRate: number;
  availability: number;
  benchmarks: Benchmark[];
}

export interface Benchmark {
  name: string;
  description: string;
  metric: string;
  value: number;
  unit: string;
  baseline: number;
  target: number;
  timestamp: Date;
  environment: string;
  version: string;
}

export interface ReportLayout {
  orientation: 'portrait' | 'landscape';
  size: 'letter' | 'legal' | 'a4' | 'a3' | 'tabloid' | 'custom';
  margins: ReportMargins;
  header: ReportSection;
  footer: ReportSection;
  body: ReportSection;
  columns: ColumnLayout[];
  grid: GridLayout;
  spacing: SpacingLayout;
  pagination: PaginationLayout;
  responsive: ResponsiveLayout;
  accessibility: AccessibilityLayout;
}

export interface ReportMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
  header: number;
  footer: number;
  gutter: number;
  bleed: number;
}

export interface ReportSection {
  enabled: boolean;
  height: number;
  content: SectionContent[];
  formatting: SectionFormatting;
  repeat: 'none' | 'all_pages' | 'first_page' | 'last_page' | 'odd_pages' | 'even_pages';
  visibility: SectionVisibility;
  interactions: SectionInteraction[];
}

export interface SectionInteraction {
  type: 'click' | 'hover' | 'focus' | 'scroll';
  action: 'expand' | 'collapse' | 'navigate' | 'filter' | 'highlight';
  target: string;
  parameters: any;
  condition: string;
}

export interface ColumnLayout {
  count: number;
  width: number[];
  spacing: number;
  separator: ColumnSeparator;
  balance: boolean;
  orphans: number;
  widows: number;
  break: ColumnBreak;
}

export interface ColumnSeparator {
  enabled: boolean;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  width: number;
  color: string;
  position: 'center' | 'left' | 'right';
}

export interface ColumnBreak {
  enabled: boolean;
  before: string[];
  after: string[];
  inside: string[];
  avoid: string[];
}

export interface GridLayout {
  enabled: boolean;
  rows: number;
  columns: number;
  cellSpacing: number;
  cellPadding: number;
  borders: boolean;
  responsive: boolean;
  breakpoints: GridBreakpoint[];
}

export interface SpacingLayout {
  lineHeight: number;
  paragraphSpacing: number;
  sectionSpacing: number;
  componentSpacing: number;
  baseline: number;
  rhythm: boolean;
}

export interface PaginationLayout {
  enabled: boolean;
  startPage: number;
  numbering: 'arabic' | 'roman' | 'alpha' | 'none';
  position: 'header' | 'footer' | 'both';
  alignment: 'left' | 'center' | 'right';
  format: string;
  separator: string;
  prefix: string;
  suffix: string;
  resetOn: string[];
  continuousNumbering: boolean;
  chaptered: boolean;
}

export interface PageResponsiveLayout {
  enabled: boolean;
  breakpoints: LayoutBreakpoint[];
  adaptationStrategy: 'mobile_first' | 'desktop_first' | 'adaptive';
  scaling: 'fluid' | 'fixed' | 'hybrid';
  images: ResponsiveImages;
  tables: ResponsiveTables;
  charts: ResponsiveCharts;
  text: ResponsiveText;
}

export interface ResponsiveCharts {
  enabled: boolean;
  scaling: 'proportional' | 'fixed' | 'adaptive';
  simplification: boolean;
  interactivity: boolean;
  fallback: 'image' | 'table' | 'text';
}

export interface ResponsiveText {
  enabled: boolean;
  scaling: 'proportional' | 'stepped' | 'fluid';
  minSize: number;
  maxSize: number;
  lineHeight: 'proportional' | 'fixed' | 'adaptive';
  wrapping: 'word' | 'character' | 'break-word';
  hyphenation: boolean;
  justification: boolean;
}

export interface AccessibilityLayout {
  enabled: boolean;
  contrast: number;
  fontSize: number;
  lineHeight: number;
  spacing: number;
  colorBlind: boolean;
  screenReader: boolean;
  keyboard: boolean;
  focus: boolean;
  aria: boolean;
  semantic: boolean;
  navigation: boolean;
  skipLinks: boolean;
  landmarks: boolean;
  headings: boolean;
  lists: boolean;
  tables: boolean;
  forms: boolean;
  images: boolean;
  links: boolean;
  buttons: boolean;
  interactive: boolean;
  media: boolean;
  animation: boolean;
  timeout: boolean;
  error: boolean;
  success: boolean;
  warning: boolean;
  information: boolean;
}

export interface ReportStyling {
  theme: StylingTheme;
  colors: StylingColors;
  typography: StylingTypography;
  spacing: StylingSpacing;
  borders: StylingBorders;
  shadows: StylingShadows;
  effects: StylingEffects;
  responsive: StylingResponsive;
  accessibility: StylingAccessibility;
  print: StylingPrint;
  interactive: StylingInteractive;
  animation: StylingAnimation;
  branding: StylingBranding;
  customization: StylingCustomization;
}

export interface StylingTheme {
  name: string;
  description: string;
  base: 'light' | 'dark' | 'auto' | 'custom';
  colors: Record<string, string>;
  fonts: Record<string, FontDefinition>;
  spacing: Record<string, number>;
  borders: Record<string, BorderDefinition>;
  shadows: Record<string, string>;
  effects: Record<string, any>;
  variables: Record<string, any>;
  overrides: Record<string, any>;
  inheritance: boolean;
  cascading: boolean;
  scoping: boolean;
  isolation: boolean;
}

export interface StylingColors {
  palette: ColorPalette;
  schemes: ColorScheme[];
  contrast: ColorContrast;
  accessibility: ColorAccessibility;
  branding: ColorBranding;
  semantic: ColorSemantic;
  functional: ColorFunctional;
  contextual: ColorContextual;
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
  semantic: string[];
  functional: string[];
  custom: Record<string, string[]>;
}

export interface ColorScheme {
  name: string;
  description: string;
  type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split_complementary' | 'custom';
  colors: string[];
  harmony: number;
  contrast: number;
  accessibility: number;
  usage: string[];
}

export interface ColorContrast {
  enabled: boolean;
  ratio: number;
  algorithm: 'wcag_aa' | 'wcag_aaa' | 'apca' | 'custom';
  testing: boolean;
  reporting: boolean;
  enforcement: boolean;
  fallback: string;
}

export interface ColorAccessibility {
  enabled: boolean;
  colorBlind: boolean;
  lowVision: boolean;
  highContrast: boolean;
  darkMode: boolean;
  simulation: boolean;
  testing: boolean;
  reporting: boolean;
  compliance: string[];
}

export interface ColorBranding {
  enabled: boolean;
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  guidelines: string;
  usage: string[];
  restrictions: string[];
  compliance: boolean;
}

export interface ColorSemantic {
  success: string;
  warning: string;
  error: string;
  info: string;
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  muted: string;
  disabled: string;
}

export interface ColorFunctional {
  text: string;
  background: string;
  border: string;
  shadow: string;
  highlight: string;
  selection: string;
  focus: string;
  hover: string;
  active: string;
  visited: string;
  disabled: string;
  placeholder: string;
}

export interface ColorContextual {
  header: string;
  footer: string;
  sidebar: string;
  content: string;
  navigation: string;
  button: string;
  link: string;
  input: string;
  table: string;
  chart: string;
  card: string;
  modal: string;
}

export interface StylingTypography {
  scale: TypographyScale;
  hierarchy: TypographyHierarchy;
  pairing: TypographyPairing;
  spacing: TypographySpacing;
  alignment: TypographyAlignment;
  decoration: TypographyDecoration;
  effects: TypographyEffects;
  responsive: TypographyResponsive;
  accessibility: TypographyAccessibility;
  internationalization: TypographyInternationalization;
}

export interface TypographyScale {
  type: 'modular' | 'linear' | 'harmonic' | 'custom';
  ratio: number;
  base: number;
  steps: number[];
  naming: string[];
  usage: string[];
}

export interface TypographyPairing {
  enabled: boolean;
  primary: string;
  secondary: string;
  accent: string;
  monospace: string;
  decorative: string;
  fallbacks: string[];
  loading: 'block' | 'swap' | 'fallback' | 'optional';
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

export interface TypographySpacing {
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  paragraphSpacing: number;
  sectionSpacing: number;
  baseline: number;
  rhythm: boolean;
  grid: boolean;
}

export interface TypographyAlignment {
  horizontal: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
  vertical: 'top' | 'middle' | 'bottom' | 'baseline' | 'sub' | 'super';
  direction: 'ltr' | 'rtl' | 'auto';
  orientation: 'horizontal' | 'vertical' | 'mixed';
}

export interface TypographyDecoration {
  underline: boolean;
  overline: boolean;
  strikethrough: boolean;
  emphasis: boolean;
  strong: boolean;
  code: boolean;
  quote: boolean;
  cite: boolean;
  abbreviation: boolean;
  definition: boolean;
  insertion: boolean;
  deletion: boolean;
  highlight: boolean;
  superscript: boolean;
  subscript: boolean;
}

export interface TypographyEffects {
  shadow: boolean;
  outline: boolean;
  glow: boolean;
  gradient: boolean;
  animation: boolean;
  transition: boolean;
  transform: boolean;
  filter: boolean;
  backdrop: boolean;
  clip: boolean;
  mask: boolean;
  blend: boolean;
}

export interface TypographyResponsive {
  enabled: boolean;
  breakpoints: TypographyBreakpoint[];
  scaling: 'linear' | 'modular' | 'fluid' | 'custom';
  strategy: 'mobile_first' | 'desktop_first' | 'adaptive';
  fallback: boolean;
  optimization: boolean;
}

export interface TypographyAccessibility {
  enabled: boolean;
  contrast: number;
  size: number;
  lineHeight: number;
  spacing: number;
  dyslexia: boolean;
  screenReader: boolean;
  keyboard: boolean;
  focus: boolean;
  selection: boolean;
  hyphenation: boolean;
  justification: boolean;
}

export interface TypographyInternationalization {
  enabled: boolean;
  languages: string[];
  direction: 'ltr' | 'rtl' | 'auto';
  script: string;
  locale: string;
  fallback: string;
  substitution: boolean;
  shaping: boolean;
  kerning: boolean;
  ligatures: boolean;
}

export interface StylingSpacing {
  system: SpacingSystem;
  units: SpacingUnits;
  scale: SpacingScale;
  rhythm: SpacingRhythm;
  grid: SpacingGrid;
  responsive: SpacingResponsive;
  semantic: SpacingSemantic;
  functional: SpacingFunctional;
}

export interface SpacingSystem {
  type: 'modular' | 'linear' | 'fibonacci' | 'golden_ratio' | 'custom';
  base: number;
  ratio: number;
  steps: number[];
  naming: string[];
  usage: string[];
}

export interface SpacingUnits {
  base: 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'vmin' | 'vmax' | 'ch' | 'ex';
  relative: boolean;
  absolute: boolean;
  viewport: boolean;
  font: boolean;
  custom: boolean;
}

export interface SpacingScale {
  micro: number;
  small: number;
  medium: number;
  large: number;
  macro: number;
  custom: Record<string, number>;
}

export interface SpacingRhythm {
  enabled: boolean;
  baseline: number;
  lineHeight: number;
  vertical: boolean;
  horizontal: boolean;
  grid: boolean;
  snap: boolean;
}

export interface SpacingGrid {
  enabled: boolean;
  size: number;
  columns: number;
  rows: number;
  gutter: number;
  margin: number;
  baseline: number;
  snap: boolean;
}

export interface SpacingResponsive {
  enabled: boolean;
  breakpoints: SpacingBreakpoint[];
  scaling: 'linear' | 'exponential' | 'custom';
  strategy: 'mobile_first' | 'desktop_first' | 'adaptive';
  optimization: boolean;
}

export interface SpacingSemantic {
  component: number;
  section: number;
  page: number;
  layout: number;
  content: number;
  navigation: number;
  form: number;
  table: number;
  list: number;
  card: number;
}

export interface SpacingFunctional {
  margin: number;
  padding: number;
  gap: number;
  indent: number;
  offset: number;
  border: number;
  shadow: number;
  outline: number;
  focus: number;
  hover: number;
}

export interface StylingBorders {
  width: BorderWidth;
  style: BorderStyle;
  color: BorderColor;
  radius: BorderRadius;
  image: BorderImage;
  responsive: BorderResponsive;
  semantic: BorderSemantic;
  functional: BorderFunctional;
}

export interface BorderWidth {
  thin: number;
  medium: number;
  thick: number;
  custom: Record<string, number>;
}

export interface BorderStyle {
  solid: boolean;
  dashed: boolean;
  dotted: boolean;
  double: boolean;
  groove: boolean;
  ridge: boolean;
  inset: boolean;
  outset: boolean;
  none: boolean;
  hidden: boolean;
}

export interface BorderColor {
  default: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  muted: string;
  disabled: string;
  custom: Record<string, string>;
}

export interface BorderRadius {
  none: number;
  small: number;
  medium: number;
  large: number;
  full: number;
  custom: Record<string, number>;
}

export interface BorderImage {
  enabled: boolean;
  source: string;
  slice: string;
  width: string;
  outset: string;
  repeat: 'stretch' | 'repeat' | 'round' | 'space';
  gradient: boolean;
  pattern: boolean;
}

export interface BorderResponsive {
  enabled: boolean;
  breakpoints: BorderBreakpoint[];
  scaling: 'proportional' | 'stepped' | 'adaptive';
  strategy: 'mobile_first' | 'desktop_first' | 'adaptive';
}

export interface BorderBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  width: number;
  style: string;
  color: string;
  radius: number;
}

export interface BorderSemantic {
  component: BorderDefinition;
  section: BorderDefinition;
  page: BorderDefinition;
  layout: BorderDefinition;
  content: BorderDefinition;
  navigation: BorderDefinition;
  form: BorderDefinition;
  table: BorderDefinition;
  list: BorderDefinition;
  card: BorderDefinition;
}

export interface BorderFunctional {
  default: BorderDefinition;
  focus: BorderDefinition;
  hover: BorderDefinition;
  active: BorderDefinition;
  disabled: BorderDefinition;
  error: BorderDefinition;
  success: BorderDefinition;
  warning: BorderDefinition;
  info: BorderDefinition;
}

export interface StylingShadows {
  elevation: ShadowElevation;
  color: ShadowColor;
  blur: ShadowBlur;
  spread: ShadowSpread;
  inset: ShadowInset;
  responsive: ShadowResponsive;
  semantic: ShadowSemantic;
  functional: ShadowFunctional;
}

export interface ShadowElevation {
  none: string;
  low: string;
  medium: string;
  high: string;
  maximum: string;
  custom: Record<string, string>;
}

export interface ShadowColor {
  default: string;
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  custom: Record<string, string>;
}

export interface ShadowBlur {
  none: number;
  small: number;
  medium: number;
  large: number;
  maximum: number;
  custom: Record<string, number>;
}

export interface ShadowSpread {
  none: number;
  small: number;
  medium: number;
  large: number;
  maximum: number;
  custom: Record<string, number>;
}

export interface ShadowInset {
  enabled: boolean;
  color: string;
  blur: number;
  spread: number;
  offset: [number, number];
}

export interface ShadowResponsive {
  enabled: boolean;
  breakpoints: ShadowBreakpoint[];
  scaling: 'proportional' | 'stepped' | 'adaptive';
  strategy: 'mobile_first' | 'desktop_first' | 'adaptive';
}

export interface ShadowBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  shadow: string;
  color: string;
  blur: number;
  spread: number;
}

export interface ShadowSemantic {
  component: string;
  section: string;
  page: string;
  layout: string;
  content: string;
  navigation: string;
  form: string;
  table: string;
  list: string;
  card: string;
}

export interface ShadowFunctional {
  default: string;
  focus: string;
  hover: string;
  active: string;
  disabled: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface StylingEffects {
  transition: EffectTransition;
  animation: EffectAnimation;
  transform: EffectTransform;
  filter: EffectFilter;
  backdrop: EffectBackdrop;
  clip: EffectClip;
  mask: EffectMask;
  blend: EffectBlend;
}

export interface EffectTransition {
  enabled: boolean;
  property: string;
  duration: number;
  timing: string;
  delay: number;
  easing: string;
  custom: Record<string, TransitionDefinition>;
}

export interface TransitionDefinition {
  property: string;
  duration: number;
  timing: string;
  delay: number;
  easing: string;
}

export interface EffectAnimation {
  enabled: boolean;
  name: string;
  duration: number;
  timing: string;
  delay: number;
  iteration: number;
  direction: string;
  fillMode: string;
  playState: string;
  custom: Record<string, AnimationDefinition>;
}

export interface AnimationDefinition {
  name: string;
  keyframes: string;
  duration: number;
  timing: string;
  delay: number;
  iteration: number;
  direction: string;
  fillMode: string;
}

export interface EffectTransform {
  enabled: boolean;
  translate: [number, number];
  scale: [number, number];
  rotate: number;
  skew: [number, number];
  origin: string;
  style: 'flat' | 'preserve-3d';
  perspective: number;
  custom: Record<string, TransformDefinition>;
}

export interface TransformDefinition {
  translate: [number, number];
  scale: [number, number];
  rotate: number;
  skew: [number, number];
  origin: string;
  style: string;
  perspective: number;
}

export interface EffectFilter {
  enabled: boolean;
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
  dropShadow: string;
  custom: Record<string, FilterDefinition>;
}

export interface FilterDefinition {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
  dropShadow: string;
}

export interface EffectBackdrop {
  enabled: boolean;
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
  custom: Record<string, BackdropDefinition>;
}

export interface BackdropDefinition {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
}

export interface EffectClip {
  enabled: boolean;
  path: string;
  rule: 'nonzero' | 'evenodd';
  box: 'border-box' | 'padding-box' | 'content-box' | 'fill-box' | 'stroke-box' | 'view-box';
  custom: Record<string, ClipDefinition>;
}

export interface ClipDefinition {
  path: string;
  rule: string;
  box: string;
}

export interface EffectMask {
  enabled: boolean;
  image: string;
  mode: 'alpha' | 'luminance' | 'match-source';
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'space' | 'round';
  position: string;
  size: string;
  origin: string;
  clip: string;
  composite: 'add' | 'subtract' | 'intersect' | 'exclude';
  custom: Record<string, any>;
}
