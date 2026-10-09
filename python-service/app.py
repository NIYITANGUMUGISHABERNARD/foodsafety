from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'food_safety'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

# Food Safety Regulations Knowledge Base
REGULATIONS = {
    'temperature': {
        'refrigerated': {'min': 0, 'max': 4, 'unit': '°C', 'description': 'Refrigerated products must be kept between 0-4°C'},
        'frozen': {'min': -18, 'max': -12, 'unit': '°C', 'description': 'Frozen products must be kept below -12°C, ideally -18°C'},
        'ambient': {'min': 10, 'max': 25, 'unit': '°C', 'description': 'Ambient storage should be 10-25°C'},
    },
    'humidity': {
        'dry': {'max': 60, 'unit': '%', 'description': 'Dry storage should not exceed 60% humidity'},
        'general': {'max': 70, 'unit': '%', 'description': 'General storage should not exceed 70% humidity'},
    },
    'expiry': {
        'critical': 3,  # days
        'warning': 7,  # days
        'description': 'Products expiring within 3 days are critical, within 7 days need attention'
    }
}

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '').lower().strip()
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        response = process_message(message, cursor)
        
        cursor.close()
        conn.close()
        
        return jsonify({'response': response})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'response': "Sorry, I encountered an error. Please try again."}), 500

def process_message(message, cursor):
    # Greetings
    if any(word in message for word in ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening']):
        return """Hello! I'm your Advanced Food Safety Assistant. I can help you with:

System Analysis:
- Analyze trends and predict risks
- Generate automatic reports
- Provide proactive suggestions

Data Queries:
- Products, batches, storage conditions
- Risk analysis and alerts
- Inspection records

Regulations:
- Food safety standards
- Temperature/humidity requirements
- Expiry date guidelines

Ask me anything about:
- Risk analysis and trends
- Batch predictions
- Safety reports
- Temperature/humidity regulations
- Proactive suggestions
- System status

What would you like to know?"""

    # Help
    elif 'help' in message or 'what can you do' in message or 'capabilities' in message:
        return """I can assist you with:

System Analysis:
- "Analyze trends" or "show trends" - View risk trends
- "Predict risks" or "risk prediction" - AI-powered predictions
- "Generate report" or "create report" - Safety reports
- "Proactive suggestions" or "recommendations" - Get suggestions

Data Queries:
- "How many products/batches?" - Count queries
- "Show unsafe batches" - View unsafe batches
- "Risk for batch X" - Check specific batch risk
- "Show risks" - View all risk analyses
- "Show alerts" or "unread alerts" - View alerts
- "Storage conditions" or "temperature/humidity" - View storage
- "Inspections" - View inspection records

Regulations:
- "Temperature regulations" or "temp rules" - Temperature standards
- "Humidity regulations" or "humidity rules" - Humidity requirements
- "Expiry regulations" or "expiry rules" - Expiry guidelines
- "Food safety regulations" - All regulations"""

    # Trend Analysis - flexible keywords
    elif any(word in message for word in ['trend', 'analyze', 'analysis', 'pattern', 'history', 'overview']):
        return analyze_trends(cursor)
    
    # Risk Prediction - flexible keywords
    elif any(word in message for word in ['predict', 'prediction', 'forecast', 'future', 'at risk', 'risk prediction']):
        return predict_risks(cursor)
    
    # Report Generation - flexible keywords
    elif any(word in message for word in ['report', 'generate', 'summary', 'overview', 'status', 'dashboard']):
        return generate_report(cursor)
    
    # Proactive Suggestions - flexible keywords
    elif any(word in message for word in ['suggest', 'proactive', 'recommend', 'advice', 'tips', 'recommendation', 'suggestion']):
        return provide_suggestions(cursor)
    
    # Regulations - flexible keywords
    elif any(word in message for word in ['regulation', 'standard', 'guideline', 'rule', 'compliance', 'requirement']):
        if any(word in message for word in ['temperature', 'temp']):
            return get_temperature_regulations()
        elif any(word in message for word in ['humidity', 'moisture']):
            return get_humidity_regulations()
        elif any(word in message for word in ['expiry', 'expir', 'expiration', 'date']):
            return get_expiry_regulations()
        else:
            return get_all_regulations()
    
    # Product queries - flexible keywords
    elif any(word in message for word in ['how many', 'count', 'total']) and 'product' in message:
        cursor.execute("SELECT COUNT(*) as count FROM products")
        result = cursor.fetchone()
        return f"There are currently {result['count']} products in the system."
    
    elif any(word in message for word in ['list', 'show', 'view', 'display', 'all']) and 'product' in message:
        cursor.execute("SELECT * FROM products LIMIT 10")
        products = cursor.fetchall()
        if not products:
            return "No products found in the system."
        product_list = "\n".join([f"- {p['name']} (ID: {p['product_id']})" for p in products])
        return f"Products in the system:\n{product_list}"
    
    # Batch queries - flexible keywords
    elif any(word in message for word in ['how many', 'count', 'total']) and 'batch' in message:
        cursor.execute("SELECT COUNT(*) as count FROM batches")
        result = cursor.fetchone()
        return f"There are currently {result['count']} batches in the system."
    
    elif 'unsafe' in message and 'batch' in message:
        cursor.execute("""
            SELECT b.batch_id, b.batch_number, r.risk_level, r.ai_score 
            FROM batches b 
            JOIN risk_analysis r ON b.batch_id = r.batch_id 
            WHERE r.risk_level = 'Unsafe'
        """)
        unsafe = cursor.fetchall()
        if not unsafe:
            return "Good news! There are no unsafe batches currently."
        batch_list = "\n".join([f"- Batch {b['batch_number']} (ID: {b['batch_id']}, Risk Score: {b['ai_score']})" for b in unsafe])
        return f"Unsafe Batches:\n{batch_list}\n\nPlease take immediate action on these batches."
    
    elif 'batch' in message and 'risk' in message:
        # Extract batch ID
        import re
        batch_match = re.search(r'batch\s*(\d+)', message)
        if batch_match:
            batch_id = batch_match.group(1)
            cursor.execute("""
                SELECT r.*, b.batch_number 
                FROM risk_analysis r 
                JOIN batches b ON r.batch_id = b.batch_id 
                WHERE r.batch_id = %s OR b.batch_number = %s
            """, (batch_id, batch_id))
            risk = cursor.fetchall()
            if not risk:
                return f"No risk analysis found for batch {batch_id}. Record storage conditions to generate analysis."
            r = risk[0]
            status = "Safe" if r['risk_level'] == 'Safe' else "Warning" if r['risk_level'] == 'Warning' else "Unsafe"
            return f"Risk Analysis for Batch {r['batch_number']}:\n- Risk Level: {r['risk_level']}\n- AI Score: {r['ai_score']}/100\n- Status: {status}"
        else:
            return "Please specify which batch. Example: 'What is the risk for batch 1?'"
    
    # Risk analysis - flexible keywords
    elif any(word in message for word in ['show', 'view', 'display', 'list', 'all']) and 'risk' in message:
        cursor.execute("""
            SELECT r.*, b.batch_number 
            FROM risk_analysis r 
            JOIN batches b ON r.batch_id = b.batch_id 
            ORDER BY r.ai_score DESC 
            LIMIT 10
        """)
        risks = cursor.fetchall()
        if not risks:
            return "No risk analyses found. Record storage conditions to generate analysis."
        risk_list = "\n".join([f"- Batch {r['batch_number']}: {r['risk_level']} (Score: {r['ai_score']})" for r in risks])
        return f"Recent Risk Analyses:\n{risk_list}"
    
    # Alerts - flexible keywords
    elif any(word in message for word in ['show', 'view', 'display', 'list', 'all']) and 'alert' in message:
        cursor.execute("""
            SELECT a.*, b.batch_number 
            FROM alerts a 
            JOIN batches b ON a.batch_id = b.batch_id 
            ORDER BY a.alert_id DESC 
            LIMIT 10
        """)
        alerts = cursor.fetchall()
        if not alerts:
            return "No alerts found. System is operating normally."
        alert_list = "\n".join([f"- Batch {a['batch_number']}: {a['alert_type']} - {a['status']}" for a in alerts])
        return f"Recent Alerts:\n{alert_list}"
    
    elif 'unread' in message and 'alert' in message:
        cursor.execute("""
            SELECT a.*, b.batch_number 
            FROM alerts a 
            JOIN batches b ON a.batch_id = b.batch_id 
            WHERE a.status = 'Unread'
            ORDER BY a.alert_id DESC
        """)
        alerts = cursor.fetchall()
        if not alerts:
            return "No unread alerts. You're all caught up!"
        alert_list = "\n".join([f"- Batch {a['batch_number']}: {a['alert_message']}" for a in alerts])
        return f"Unread Alerts ({len(alerts)}):\n{alert_list}"
    
    # Storage conditions
    elif 'temperature' in message or 'humidity' in message:
        cursor.execute("""
            SELECT s.*, b.batch_number 
            FROM storage_conditions s 
            JOIN batches b ON s.batch_id = b.batch_id 
            ORDER BY s.recorded_at DESC 
            LIMIT 5
        """)
        storage = cursor.fetchall()
        if not storage:
            return "No storage conditions recorded yet."
        storage_list = "\n".join([f"- Batch {s['batch_number']}: {s['temperature']}°C, {s['humidity']}% humidity" for s in storage])
        return f"Recent Storage Conditions:\n{storage_list}"
    
    # Inspections
    elif 'inspection' in message:
        cursor.execute("""
            SELECT i.*, b.batch_number 
            FROM inspections i 
            JOIN batches b ON i.batch_id = b.batch_id 
            ORDER BY i.inspection_id DESC 
            LIMIT 10
        """)
        inspections = cursor.fetchall()
        if not inspections:
            return "No inspections recorded yet."
        inspection_list = "\n".join([f"- Batch {i['batch_number']}: {i['status']} by Inspector {i['inspector_id']}" for i in inspections])
        return f"Recent Inspections:\n{inspection_list}"
    
    # Default
    else:
        return "I'm not sure about that. Try asking about:\n- Trend analysis\n- Risk prediction\n- Reports\n- Proactive suggestions\n- Regulations\n- Products, batches, risks, alerts\n\nType 'help' for more options."

def analyze_trends(cursor):
    """Analyze risk trends over time"""
    try:
        cursor.execute("""
            SELECT r.risk_level, COUNT(*) as count
            FROM risk_analysis r
            GROUP BY r.risk_level
        """)
        distribution = cursor.fetchall()
        
        if not distribution:
            return "No risk analysis data available yet. Record storage conditions to generate risk analysis."
        
        summary = "**Risk Analysis Overview:**\n\n"
        total = sum(d['count'] for d in distribution)
        
        for d in distribution:
            pct = (d['count'] / total) * 100
            status = "Safe" if d['risk_level'] == 'Safe' else "Warning" if d['risk_level'] == 'Warning' else "Unsafe"
            summary += f"- {status}: {d['count']} batches ({pct:.1f}%)\n"
        
        return summary
    except Exception as e:
        return f"Error analyzing trends: {str(e)}"

def predict_risks(cursor):
    """Predict which batches are at risk"""
    try:
        # Get batches with storage conditions
        cursor.execute("""
            SELECT b.batch_id, b.batch_number, b.expiry_date,
                   s.temperature, s.humidity, s.storage_type
            FROM batches b
            LEFT JOIN storage_conditions s ON b.batch_id = s.batch_id
            ORDER BY b.expiry_date ASC
        """)
        batches = cursor.fetchall()
        
        if not batches:
            return "No batch data available for prediction."
        
        predictions = []
        for batch in batches:
            risk_score = 0
            factors = []
            
            # Temperature factor
            if batch['temperature']:
                if batch['temperature'] > 35:
                    risk_score += 40
                    factors.append("High temperature")
                elif batch['temperature'] > 25:
                    risk_score += 20
                    factors.append("Elevated temperature")
            
            # Humidity factor
            if batch['humidity']:
                if batch['humidity'] > 70:
                    risk_score += 30
                    factors.append("High humidity")
                elif batch['humidity'] > 60:
                    risk_score += 15
                    factors.append("Elevated humidity")
            
            # Expiry factor
            if batch['expiry_date']:
                from datetime import datetime
                expiry = batch['expiry_date']
                today = datetime.now().date()
                if isinstance(expiry, datetime):
                    expiry = expiry.date()
                days_left = (expiry - today).days if expiry else 0
                
                if days_left < 0:
                    risk_score += 100
                    factors.append("EXPIRED")
                elif days_left < 3:
                    risk_score += 40
                    factors.append("Expiring soon (3 days)")
                elif days_left < 7:
                    risk_score += 20
                    factors.append("Expiring soon (7 days)")
            
            if risk_score >= 40:
                risk_level = "High Risk" if risk_score >= 70 else "Medium Risk"
                predictions.append({
                    'batch': batch['batch_number'],
                    'risk_level': risk_level,
                    'score': risk_score,
                    'factors': factors
                })
        
        if not predictions:
            return "No batches currently predicted to be at risk."
        
        summary = "**Risk Predictions:**\n\n"
        for pred in predictions[:5]:
            summary += f"{pred['risk_level']} - Batch {pred['batch']} (Score: {pred['score']})\n"
            summary += f"   Factors: {', '.join(pred['factors'])}\n\n"
        
        return summary
    except Exception as e:
        return f"Error predicting risks: {str(e)}"

def generate_report(cursor):
    """Generate a comprehensive safety report"""
    try:
        report = "**Food Safety Report**\n"
        report += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        # System Overview
        cursor.execute("SELECT COUNT(*) as count FROM products")
        products = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM batches")
        batches = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM risk_analysis WHERE risk_level = 'Unsafe'")
        unsafe = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM alerts WHERE status = 'Unread'")
        unread_alerts = cursor.fetchone()['count']
        
        report += "**System Overview:**\n"
        report += f"- Total Products: {products}\n"
        report += f"- Total Batches: {batches}\n"
        report += f"- Unsafe Batches: {unsafe}\n"
        report += f"- Unread Alerts: {unread_alerts}\n\n"
        
        # Risk Summary
        cursor.execute("""
            SELECT risk_level, COUNT(*) as count
            FROM risk_analysis
            GROUP BY risk_level
        """)
        risks = cursor.fetchall()
        
        report += "**Risk Summary:**\n"
        for r in risks:
            report += f"- {r['risk_level']}: {r['count']}\n"
        report += "\n"
        
        # Storage Conditions
        cursor.execute("""
            SELECT AVG(temperature) as avg_temp, AVG(humidity) as avg_humidity
            FROM storage_conditions
        """)
        storage = cursor.fetchone()
        
        if storage['avg_temp']:
            report += "**Average Storage Conditions:**\n"
            report += f"- Temperature: {storage['avg_temp']:.1f}°C\n"
            report += f"- Humidity: {storage['avg_humidity']:.1f}%\n\n"
        
        # Recommendations
        report += "**Recommendations:**\n"
        if unsafe > 0:
            report += f"- IMMEDIATE: Address {unsafe} unsafe batches\n"
        if unread_alerts > 0:
            report += f"- Review {unread_alerts} unread alerts\n"
        if storage and storage['avg_temp'] > 25:
            report += f"- Monitor high temperature (avg: {storage['avg_temp']:.1f}°C)\n"
        if storage and storage['avg_humidity'] > 60:
            report += f"- Monitor high humidity (avg: {storage['avg_humidity']:.1f}%)\n"
        
        return report
    except Exception as e:
        return f"Error generating report: {str(e)}"

def provide_suggestions(cursor):
    """Provide proactive safety suggestions"""
    try:
        suggestions = []
        
        # Check for expiring batches
        from datetime import datetime, timedelta
        today = datetime.now().date()
        next_week = today + timedelta(days=7)
        
        cursor.execute("""
            SELECT batch_id, batch_number, expiry_date
            FROM batches
            WHERE expiry_date BETWEEN %s AND %s
            ORDER BY expiry_date ASC
        """, (today, next_week))
        expiring = cursor.fetchall()
        
        if expiring:
            suggestions.append(f"{len(expiring)} batches expiring within 7 days - Prioritize inspection and consumption")
        
        # Check for high temperature readings
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM storage_conditions
            WHERE temperature > 25
        """)
        high_temp = cursor.fetchone()['count']
        
        if high_temp > 0:
            suggestions.append(f"{high_temp} high temperature readings - Check refrigeration systems")
        
        # Check for high humidity
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM storage_conditions
            WHERE humidity > 60
        """)
        high_humidity = cursor.fetchone()['count']
        
        if high_humidity > 0:
            suggestions.append(f"{high_humidity} high humidity readings - Improve ventilation")
        
        # Check for unread alerts
        cursor.execute("SELECT COUNT(*) as count FROM alerts WHERE status = 'Unread'")
        unread = cursor.fetchone()['count']
        
        if unread > 0:
            suggestions.append(f"{unread} unread alerts - Review and take action")
        
        # Check for failed inspections
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM inspections
            WHERE status = 'Failed'
        """)
        failed = cursor.fetchone()['count']
        
        if failed > 0:
            suggestions.append(f"{failed} failed inspections - Investigate quality issues")
        
        if not suggestions:
            return "All systems operating normally. No immediate suggestions at this time."
        
        summary = "**Proactive Suggestions:**\n\n"
        for suggestion in suggestions:
            summary += f"- {suggestion}\n"
        
        summary += "\nRegular monitoring and preventive maintenance can help avoid safety issues."
        return summary
    except Exception as e:
        return f"Error providing suggestions: {str(e)}"

def get_temperature_regulations():
    """Get temperature regulations"""
    reg = REGULATIONS['temperature']
    summary = "**Temperature Regulations:**\n\n"
    for storage_type, rules in reg.items():
        summary += f"**{storage_type.capitalize()} Storage:**\n"
        summary += f"- Range: {rules['min']} to {rules['max']} {rules['unit']}\n"
        summary += f"- {rules['description']}\n\n"
    return summary

def get_humidity_regulations():
    """Get humidity regulations"""
    reg = REGULATIONS['humidity']
    summary = "**Humidity Regulations:**\n\n"
    for storage_type, rules in reg.items():
        summary += f"**{storage_type.capitalize()} Storage:**\n"
        summary += f"- Maximum: {rules['max']} {rules['unit']}\n"
        summary += f"- {rules['description']}\n\n"
    return summary

def get_expiry_regulations():
    """Get expiry date regulations"""
    reg = REGULATIONS['expiry']
    summary = "**Expiry Date Guidelines:**\n\n"
    summary += f"- **Critical Period:** {reg['critical']} days before expiry\n"
    summary += f"- **Warning Period:** {reg['warning']} days before expiry\n"
    summary += f"- {reg['description']}\n\n"
    summary += "Products in critical period should be prioritized for inspection or consumption."
    return summary

def get_all_regulations():
    """Get all regulations"""
    return f"""**Food Safety Regulations:**\n\n

{get_temperature_regulations()}

{get_humidity_regulations()}

{get_expiry_regulations()}

**General Guidelines:**
- Monitor storage conditions regularly
- Maintain proper temperature and humidity levels
- Implement FIFO (First In, First Out) for inventory
- Conduct regular quality inspections
- Train staff on food safety protocols"""

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
