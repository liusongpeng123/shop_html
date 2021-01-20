<template>
  <div class="body">

    <div class="tbody">
      <el-steps :active="active" finish-status="success">
        <el-step title="商品信息"></el-step>
        <el-step title="属性信息"></el-step>
        <el-step title="提交"></el-step>
      </el-steps>
      <!-- 个人信息 -->
      <div class="info" v-if="active==1">
        <el-form ref="shopAdd" :model="shopAdd" label-width="80px">

          <el-form-item label="商品名称">
            <el-input v-model="shopAdd.name" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="商品标题">
            <el-input v-model="shopAdd.title" style="width: 500px"></el-input>
          </el-form-item>

          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="shopAdd.brandId" placeholder="请选择分类">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option v-for="item in BrandData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品介绍">
            <el-input type="textarea" style="width: 200px"  v-model="shopAdd.productdecs"></el-input>
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="shopAdd.price" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="商品库存">
            <el-input v-model="shopAdd.stocks"></el-input>
          </el-form-item>

          <el-form-item label="排序字段">
            <el-input v-model="shopAdd.sortNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="info" v-if="active==2">
        <el-form ref="peopertyAdd" :model="peopertyAdd" label-width="80px" >
          <el-form-item label="商品类型" prop="typeId">
            <el-select v-model="peopertyAdd.typeId" placeholder="请选择分类" @change="selectChange">
              <el-option v-for="item in TypeData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-model="peopertyAdd.peopertyId" v-if="skuData.length>0" label="商品sku" prop="peopertyId">

            <el-form-item v-for="a in  skuData" :key="a.id" :label="a.peopertyName">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-select v-if="a.peopertyType==0" v-model="xia" placeholder="请选择">
                <el-option v-for="item in a.values" :key="item.id"  :label="item.peopertyName" :value="item.nameCh"></el-option>
              </el-select>

              <el-radio-group  v-if="a.peopertyType==1" v-model="dan">
                <el-radio v-for="item in a.values" :key="item.id" :label="item.nameCh"></el-radio>
              </el-radio-group>

              <el-checkbox-group  v-if="a.peopertyType==2" v-model="a.ckValues" @change="skuChange">
                <el-checkbox v-for="item in a.values" :key="item.id" :label="item.nameCh" ></el-checkbox>
              </el-checkbox-group>

              <el-input v-if="a.peopertyType==3"></el-input>
            </el-form-item>


          </el-form-item>

          <el-table
            v-if="tableShow"
            :data="tableSkuData"
            style="width: 100%" :span-method="objectSpanMethod1">
            <!--   动态展示列头  sku属性中文名 -->
            <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">
            </el-table-column>

            <el-table-column
              label="库存"
              width="180">

              <template slot-scope="scope">
                <el-input/>
              </template>

            </el-table-column>
            <el-table-column
              label="价格"
              width="180">
              <template slot-scope="scope">
                <el-input/>
              </template>
            </el-table-column>
          </el-table>




          <el-form-item v-model="peoper" v-if="notSkuData.length>0" label="商品属性" prop="peopertyId">

            <el-form-item v-for="a in  notSkuData" :key="a.id" :label="a.peopertyName">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-select v-if="a.peopertyType==0" v-model="xia" placeholder="请选择">
                <el-option v-for="item in a.values" :key="item.id"  :label="item.peopertyName" :value="item.nameCh"></el-option>
              </el-select>

              <el-radio-group  v-if="a.peopertyType==1" v-model="dan">
                <el-radio v-for="item in a.values" :key="item.id" :label="item.nameCh"></el-radio>
              </el-radio-group>

              <el-checkbox-group  v-if="a.peopertyType==2" v-model="duo">
                <el-checkbox v-for="item in a.values" :key="item.id" :label="item.nameCh" name="type"></el-checkbox>
              </el-checkbox-group>

              <el-input v-if="a.peopertyType==3"></el-input>
            </el-form-item>


          </el-form-item>

        </el-form>

        <div>
        </div>
      </div>
      <div class="info" v-if="active==3">
        商品提交
      </div>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      <el-button style="margin-top: 12px;" @click="pre" v-if="active>1">上一步</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name:"ShopAdd",
    data() {
      return {
        active: 1,
        shopAdd:{},
        BrandData:{},//品牌
        TypeData:[],//所有分类的每个类型
        TypeDatas:[],//所有分类的类型
        peopertyAdd:{},//商品类型
        peoper:{},     //商品属性
        peopertyData:[],
        skuData:[],//sku属性
        notSkuData:[],//非sku属性
        dan:"",
        xia:"",
        duo:[],
        tableShow:false,
        tableSkuData:[],//动态表头对应的表格数据
        cols:[]//动态表头

      };
    },methods: {
      /* 笛卡尔积    */
      calcDescartes:function(array) {
        if (array.length < 2) return array[0] || [];
        return [].reduce.call(array, function (col, set) {
          var res = [];
          col.forEach(function (c) {
            set.forEach(function (s) {
              var t = [].concat(Array.isArray(c) ? c : [c]);
              t.push(s);
              res.push(t);
            })
          });
          return res;
        });
      },// 合并行数
  /*    objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
        // columnIndex === 0 找到第一列，实现合并随机出现的行数
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
          // columnIndex === 1 找到第二列，合并他的列数
        } else if (columnIndex === 1) {
          const _row = this.spanArr1[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
      },*/
      //监听sku属性 改变事件
      skuChange:function(){

        //笛卡尔积的参数
        let  kdej=[];
        //清空表格数据
        this.tableSkuData=[];
        //清空动态表头数据
        this.cols=[];
        //判断是否要生成笛卡尔积
        let flag=true;
        for (let i = 0; i <this.skuData.length ; i++) {
          this.cols.push({"id":this.skuData[i].id,"nameCH":this.skuData[i].peopertyName,"name":this.skuData[i].peopertyId});
          kdej.push(this.skuData[i].ckValues);
          if(this.skuData[i].ckValues.length==0){
            for (let j = 0; j < this.ckValues.length; j++) {
              flag=false;
              break;
            }

          }
        }
        if(flag==true){
          debugger;
          console.log(this.newData);
          let  datas=this.calcDescartes(kdej);
          for (let i = 0; i <datas.length ; i++) {
            //遍历笛卡尔积 的每一项   [红色,16g]  cols:[{"id":1,"name": ,"nameCH"}]

            let jsonData = {}; //笛卡尔积 转为json的对象
            for (let j = 0; j < datas[i].length; j++) {
              //获取数据的key
              let key = this.cols[j].name;
              jsonData[key] = datas[i][j]

            }
            this.tableSkuData.push(jsonData);
          }
          console.log(this.tableSkuData);
          console.log(datas);
        }
        this.tableShow=flag;
      },

      next() {
        if (this.active++ > 3) this.active = 1;
      },
      pre() {
        if (this.active-- < 2) this.active = 1;
      },
      getTypeData(){
        this.$axios.get("http://localhost:8080/api/type/getData").then(rs=>{
          //定义的数据     TypeDatas 等于查询出来的所有数据
          this.TypeDatas=rs.data.data;
          //查看有没有子节点数据
          this.getChildrenType();
          for (let i = 0; i <this.TypeData.length ; i++) {
            this.typeName="";
            this.diGui(this.TypeData[i]);
            //给name重新赋值
            this.TypeData[i].name=this.typeName.split("/").reverse().join("/").substr(0,this.typeName.length-1);

          }
        }).catch(err=>{
          console.log("查询类型失败")})
      },
      diGui(node){
        if(node.pid!=0){ //临界值
          this.typeName+="/"+node.name;
          //上级节点
          for (let i = 0; i <this.TypeDatas.length ; i++) {
            if(node.pid==this.TypeDatas[i].id){
              this.diGui(this.TypeDatas[i]);
              break;
            }
          }

        }else{
          this.typeName+="/"+node.name;
        }
      },
      getChildrenType:function(){
        //遍历所有的节点数据
        for (let i = 0; i <this.TypeDatas.length ; i++) {
          //节点中所有数据的一条
          let  node=this.TypeDatas[i];
          //判断有没有子节点
          this.isChildrenNode(node);
        }
      },
      isChildrenNode:function(node){
        let rs=true; //标示
        for (let i = 0; i <this.TypeDatas.length ; i++) {
          //如果数据的id有指向所有数据的pid 证明是下面还有节点的
          if(node.id==this.TypeDatas[i].pid){
            rs=false;
            break;
          }
        }
        if(rs==true){
          //将数据放到表中需要的字段中
          this.TypeData.push(node);
        }
      },
      selectChange(val){
        this.notSkuData=[];
        this.skuData=[];
        this.$axios.get("http://localhost:8080/api/peoperty/queryPeopertyByTypeId?typeId="+val).then(rs=>{
          /* console.log(rs.data);*/
          let peopertyData=rs.data;

          //判断分类是否有数据   更新 参数和规格
          if(peopertyData.length>0){
            for (let i = 0; i <peopertyData.length ; i++) {
              if (peopertyData[i].isSku==0){
                if(peopertyData[i].peopertyType!=3){
                  //得到属性类型不为3（输入框）的所有属性值
                  this.$axios.get("http://localhost:8080/api/peopertyValue/queryByPeoId?peoId="+peopertyData[i].id).then(rs=>{
                    peopertyData[i].values=rs.data;
                    peopertyData[i].ckValues=[];
                    this.skuData.push(peopertyData[i]);
                  }).catch(err=>console.log("查询属性信息失败"))
                }
                else{
                  peopertyData[i].ckValues=[];
                  this.skuData.push(peopertyData[i]);
                }
              }else{
                if(peopertyData[i].peopertyType!=3){
                  //得到属性类型不为3（输入框）的所有属性值
                  this.$axios.get("http://localhost:8080/api/peopertyValue/queryByPeoId?peoId="+peopertyData[i].id).then(rs=>{
                    peopertyData[i].values=rs.data;
                    /* console.log(rs.data.data);*/
                    this.notSkuData.push(peopertyData[i]);

                  }).catch(err=>console.log("查询属性信息失败"))
                }
                else{
                  this.notSkuData.push(peopertyData[i]);
                }
              }
            }
          }else{
            this.notSkuData=[];
            this.skuData=[];
          }
        });
        /* console.log(this.skuData);
         console.log(this.notSkuData);*/
      },//笛卡尔积算法
      descartes(array){

        if( array.length < 2 ) return array[0] || [];
        return [].reduce.call(array, function(col, set) {
          var res = [];
          col.forEach(function(c) {
            set.forEach(function(s) {
              var t = [].concat( Array.isArray(c) ? c : [c] );
              t.push(s);
              res.push(t);
            })});
          return res;
        });
      }


    },
    created(){
      this.$axios.get("http://localhost:8080/api/brand/queryAllBrandData").then(rs=>{
        this.BrandData=rs.data;
      }).catch(err=>{console.log("查询品牌信息失败")});
      this.getTypeData();
    }
  }
</script>
<style>
  .tbody{
    width:80%;
    margin-left:10%;
    margin-top: 2%;

  }
</style>
