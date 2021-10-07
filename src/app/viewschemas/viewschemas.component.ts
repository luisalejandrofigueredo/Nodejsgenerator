import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
/*import { files } from './example-data';*/
import { ConfigServiceService } from '../service/config/config-service.service';
import { ConfigService } from '../service/config.service';
import { RelationsService } from '../service/relations.service';

/** File node data with possible child nodes. */
export interface FileNode {
  name: string;
  type: string;
  children?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}


@Component({
  selector: 'app-viewschemas',
  templateUrl: './viewschemas.component.html',
  styleUrls: ['./viewschemas.component.scss']
})
export class ViewschemasComponent implements OnInit {
  @Input() id: number = 1;
  files: FileNode[] = [];
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  constructor(private configservice: ConfigService, private relationservice: RelationsService) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.configservice.getschematable(this.id).forEach(field => { this.files.push({ name: field.name, type: field.type }) });
    this.relationservice.getrelationsonetone(this.id).forEach(oneToOne => {
      this.files.push({ name: 'Relation one to one:'+oneToOne.relationname, type: 'relation', children: this.createChildren(oneToOne.table) });
    });
    this.relationservice.getrelationsonetomany(this.id).forEach(oneToMany => {
      this.files.push({ name: 'Relation one to many:'+oneToMany.relationname, type: 'relation', children: this.createChildren(oneToMany.table) });
    });
    this.relationservice.getrelationmanytoone(this.id).forEach(manyToOne => {
      this.files.push({ name: 'Relation many to one:'+manyToOne.relationname, type: 'relation', children: this.createChildren(manyToOne.table) });
    });
    this.relationservice.getrelationsmanytomany(this.id).forEach(manyToMany => {
      this.files.push({ name: 'Relation many to many:'+manyToMany.relationname, type: 'relation', children: this.createChildren(manyToMany.table) });
    });
    this.dataSource.data = this.files;
  }

  createChildren(table: string): FileNode[] {
    let files: FileNode[] = []
    this.configservice.getschematable(this.configservice.getschemawithname(table)).forEach(
      field => { files.push({ name: field.name, type: field.type }) }
    );
    return files;
  }
  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number): FlatTreeNode {
    return {
      name: node.name,
      type: node.type,
      level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode): number {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode): FileNode[] | null | undefined {
    return node.children;
  }
}
